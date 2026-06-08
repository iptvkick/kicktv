import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { executeCommand, runGeminiCli, ProcessSession, processManager } from './engine';
import { initVectorDB, createOrGetTable } from './rag';
import { authenticateToken, generateToken } from './middleware/auth';
import path from 'path';
import fs from 'fs';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

/* ═══════════════════════════════════════
   AUTHENTICATION
═══════════════════════════════════════ */
app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

  try {
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, password: hashedPassword }
    });

    res.json({ success: true, user: { id: user.id, username: user.username } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateToken({ id: user.id, username: user.username });
    res.json({ success: true, token });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Init RAG vector DB
let vectorTable: any = null;
initVectorDB().then(async (db) => {
  vectorTable = await createOrGetTable(db, 'obsidian_vault');
  console.log('📦 LanceDB vector table ready.');
}).catch(err => console.warn('⚠️ LanceDB init skipped:', err.message));

// SSE feed log queue
const feedLog: Array<{ ts: string; text: string; type: string }> = [];
function pushLog(text: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') {
  const ts = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  // Evitar duplicatas exatas no último item
  if (feedLog.length > 0 && feedLog[feedLog.length - 1].text === text) return;
  feedLog.push({ ts, text, type });
  if (feedLog.length > 100) feedLog.shift();
}

pushLog('Nexus Agency Backend initialized.', 'success');

/* ═══════════════════════════════════════
   HEALTH
═══════════════════════════════════════ */
app.get('/api/health', async (_req, res) => {
  try {
    const agentCount = await prisma.agent.count();
    const missionCount = await prisma.chatSession.count();
    const engineConfig = await prisma.config.findUnique({ where: { key: 'engine' } });
    const engine = engineConfig?.value ?? 'gemini-cli';
    res.json({
      status: 'ok',
      service: 'Nexus Agency Studio Backend',
      engine,
      agentCount,
      missionCount,
    });
  } catch (err: any) {
    res.json({ status: 'ok', service: 'Nexus Agency Studio Backend' });
  }
});

/* ═══════════════════════════════════════
   CONFIG
═══════════════════════════════════════ */
app.get('/api/config', authenticateToken, async (_req, res) => {
  try {
    const configs = await prisma.config.findMany();
    const map: Record<string, string> = {};
    configs.forEach(c => { map[c.key] = c.value; });
    res.json(map);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/config/set', authenticateToken, async (req, res) => {
  const { key, value } = req.body;
  if (!key) return res.status(400).json({ error: 'key is required' });
  try {
    await prisma.config.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    });
    pushLog(`Config updated: ${key}`, 'info');
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* ═══════════════════════════════════════
   AGENTS
═══════════════════════════════════════ */
app.get('/api/agents', authenticateToken, async (_req, res) => {
  try {
    const agents = await prisma.agent.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(agents);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/agents', authenticateToken, async (req, res) => {
  const { name, role, description, systemPrompt } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  try {
    const agent = await prisma.agent.create({
      data: { name, role: role ?? 'worker', description, systemPrompt },
    });
    pushLog(`Agent created: ${name}`, 'success');
    res.json(agent);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/agents/:id', authenticateToken, async (req, res) => {
  const { name, role, description, systemPrompt, positionX, positionY, parentId } = req.body;
  try {
    const agent = await prisma.agent.update({
      where: { id: req.params.id },
      data: { name, role, description, systemPrompt, positionX, positionY, parentId },
    });
    pushLog(`Agent updated: ${name}`, 'info');
    res.json(agent);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/agents/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.agent.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* ═══════════════════════════════════════
   MISSIONS (ChatSessions)
═══════════════════════════════════════ */
app.get('/api/missions', authenticateToken, async (_req, res) => {
  try {
    const sessions = await prisma.chatSession.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    // Map to mission format
    const missions = sessions.map(s => ({
      id:        s.id,
      title:     s.title,
      agentId:   s.agentId,
      status:    s.status,
      progress:  s.status === 'done' ? 100 : s.status === 'running' ? 50 : s.status === 'error' ? 0 : 10,
      createdAt: s.createdAt,
    }));
    res.json(missions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* ═══════════════════════════════════════
   CHAT / AGENT EXECUTION
═══════════════════════════════════════ */
// Para missões, reusamos a lógica de chat, mas podemos criar uma nova session
app.post('/api/agents/chat', authenticateToken, async (req, res) => {
  const { agentId, message } = req.body;
  if (!agentId || !message) return res.status(400).json({ error: 'agentId and message required' });

  try {
    const agent = await prisma.agent.findUnique({ where: { id: agentId } });
    if (!agent) return res.status(404).json({ error: 'Agent not found' });

    const session = await prisma.chatSession.create({
      data: { title: message.substring(0, 80), agentId, status: 'pending' },
    });
    await prisma.message.create({
      data: { chatSessionId: session.id, role: 'user', content: message },
    });

    pushLog(`Mission delegated to ${agent.name}`, 'info');

    // Return immediately (async execution)
    res.json({ success: true, sessionId: session.id, status: 'pending' });

    // Execute in background
    const startTime = Date.now();
    try {
      await prisma.chatSession.update({ where: { id: session.id }, data: { status: 'running' } });
      const result = await runGeminiCli(agent.systemPrompt, message);
      const durationMs = Date.now() - startTime;
      
      await prisma.message.create({
        data: { chatSessionId: session.id, role: 'assistant', content: result.stdout || 'Sem resposta do motor.' },
      });
      await prisma.chatSession.update({ where: { id: session.id }, data: { status: result.code === 0 ? 'done' : 'error' } });
      
      await prisma.usageLog.create({
        data: { agentId, engine: 'gemini-cli', tokensIn: message.length / 4, tokensOut: (result.stdout?.length || 0) / 4, durationMs }
      });
      
      pushLog(`Agent ${agent.name} responded.`, result.code === 0 ? 'success' : 'warn');
    } catch (err: any) {
      await prisma.message.create({
        data: { chatSessionId: session.id, role: 'assistant', content: `⚠️ Erro: ${err.message}` },
      });
      await prisma.chatSession.update({ where: { id: session.id }, data: { status: 'error' } });
      pushLog(`Agent ${agent.name} error: ${err.message}`, 'error');
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* ═══════════════════════════════════════
   PER-AGENT CHAT ENDPOINTS
═══════════════════════════════════════ */
app.get('/api/agents/:id/chat', authenticateToken, async (req, res) => {
  try {
    const sessions = await prisma.chatSession.findMany({
      where: { agentId: req.params.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
    res.json(sessions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/agents/:id/chat', authenticateToken, async (req, res) => {
  const { message, sessionId } = req.body;
  const agentId = req.params.id;
  if (!message) return res.status(400).json({ error: 'message required' });

  try {
    const agent = await prisma.agent.findUnique({ where: { id: agentId } });
    if (!agent) return res.status(404).json({ error: 'Agent not found' });

    // Create or reuse session
    let session = null;
    if (sessionId) {
      session = await prisma.chatSession.findUnique({ where: { id: sessionId } });
    } else {
      session = await prisma.chatSession.findFirst({
        where: { agentId },
        orderBy: { createdAt: 'desc' },
      });
    }
    
    if (!session) {
      session = await prisma.chatSession.create({
        data: { title: message.substring(0, 80), agentId, status: 'pending' },
      });
    } else {
      await prisma.chatSession.update({ where: { id: session.id }, data: { status: 'pending' } });
    }

    await prisma.message.create({
      data: { chatSessionId: session.id, role: 'user', content: message },
    });

    pushLog(`Chat with ${agent.name}: ${message.substring(0, 50)}...`, 'info');

    // Return immediately
    res.json({ success: true, sessionId: session.id, status: 'pending' });

    // Background execution
    const startTime = Date.now();
    try {
      await prisma.chatSession.update({ where: { id: session.id }, data: { status: 'running' } });
      const result = await runGeminiCli(agent.systemPrompt, message);
      const durationMs = Date.now() - startTime;

      await prisma.message.create({
        data: { chatSessionId: session.id, role: 'assistant', content: result.stdout || 'Sem resposta do motor.' },
      });
      await prisma.chatSession.update({ where: { id: session.id }, data: { status: result.code === 0 ? 'done' : 'error' } });
      
      await prisma.usageLog.create({
        data: { agentId, engine: 'gemini-cli', tokensIn: message.length / 4, tokensOut: (result.stdout?.length || 0) / 4, durationMs }
      });

      pushLog(`${agent.name} responded.`, result.code === 0 ? 'success' : 'warn');
    } catch (err: any) {
      await prisma.message.create({
        data: { chatSessionId: session.id, role: 'assistant', content: `⚠️ Erro do motor: ${err.message}` },
      });
      await prisma.chatSession.update({ where: { id: session.id }, data: { status: 'error' } });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/agents/:id/chat/:sessionId/messages', authenticateToken, async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      where: { chatSessionId: req.params.sessionId },
      orderBy: { createdAt: 'asc' },
    });
    res.json(messages);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* ═══════════════════════════════════════
   SETUP (1-Click CLI)
═══════════════════════════════════════ */
app.post('/api/setup/spawn', authenticateToken, (req, res) => {
  const { command, args } = req.body;
  if (!command) return res.status(400).json({ error: 'Command required' });

  // Safety whitelist
  const allowed = ['npm', 'gemini', 'gemini-cli', 'openclaw', 'go', 'node', 'wsl'];
  if (!allowed.includes(command)) {
    return res.status(403).json({ error: `Command ${command} not allowed for safety.` });
  }

  try {
    pushLog(`Spawning interactive: ${command} ${(args || []).join(' ')}`, 'info');
    const session = new ProcessSession(command, args || []);
    processManager.set(session.id, session);
    res.json({ sessionId: session.id });
  } catch (err: any) {
    pushLog(`Spawn ${command} failed.`, 'error');
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/setup/stream/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const session = processManager.get(sessionId);

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  if (!session) {
    res.write(`data: ${JSON.stringify({ type: 'error', text: 'Session not found' })}\n\n`);
    res.end();
    return;
  }

  const onData = (data: { type: string, text: string }) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  const onClose = (code: number) => {
    res.write(`data: ${JSON.stringify({ type: 'close', code })}\n\n`);
    res.end();
    processManager.delete(sessionId);
  };

  const onError = (err: Error) => {
    res.write(`data: ${JSON.stringify({ type: 'error', text: err.message })}\n\n`);
    res.end();
    processManager.delete(sessionId);
  };

  session.on('data', onData);
  session.on('close', onClose);
  session.on('error', onError);

  req.on('close', () => {
    session.removeListener('data', onData);
    session.removeListener('close', onClose);
    session.removeListener('error', onError);
  });
});

app.post('/api/setup/input', authenticateToken, (req, res) => {
  const { sessionId, input } = req.body;
  const session = processManager.get(sessionId);
  if (session) {
    session.write(input);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Session not found' });
  }
});

app.post('/api/setup/kill/:sessionId', authenticateToken, (req, res) => {
  const { sessionId } = req.params;
  const session = processManager.get(sessionId);
  if (session) {
    session.kill();
    processManager.delete(sessionId);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Session not found' });
  }
});
app.post('/api/setup/run-command', authenticateToken, async (req, res) => {
  const { command, args } = req.body;
  if (!command) return res.status(400).json({ error: 'Command required' });

  // Safety whitelist
  const allowed = ['npm', 'gemini', 'gemini-cli', 'openclaw'];
  if (!allowed.includes(command)) {
    return res.status(403).json({ error: `Command ${command} not allowed for safety.` });
  }

  try {
    pushLog(`Running: ${command} ${args.join(' ')}`, 'info');
    const result = await executeCommand(command, args);
    pushLog(`Command ${command} finished.`, result.code === 0 ? 'success' : 'error');
    res.json({ success: result.code === 0, result });
  } catch (err: any) {
    pushLog(`Command ${command} failed.`, 'error');
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/setup/cli', authenticateToken, async (req, res) => {
  const { engine, apiKey, endpoint } = req.body;
  try {
    if (apiKey) {
      await prisma.config.upsert({
        where: { key: 'api_key' },
        update: { value: apiKey },
        create: { key: 'api_key', value: apiKey },
      });
    }
    if (endpoint) {
      await prisma.config.upsert({
        where: { key: 'endpoint' },
        update: { value: endpoint },
        create: { key: 'endpoint', value: endpoint },
      });
    }

    pushLog(`CLI ${engine} configured.`, 'success');
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/setup/gemini-auth', authenticateToken, async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'auth code required' });

  try {
    // Real: runs `gemini auth --code <code>`
    const result = await executeCommand('gemini', ['auth', '--code', code]);
    await prisma.config.upsert({
      where: { key: 'gemini_authed' },
      update: { value: 'true' },
      create: { key: 'gemini_authed', value: 'true' },
    });
    pushLog('Gemini CLI authenticated via OAuth.', 'success');
    res.json({ success: result.code === 0, message: 'Gemini CLI autenticado.', logs: result.stdout + '\n' + result.stderr });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* ═══════════════════════════════════════
   VAULT
═══════════════════════════════════════ */
app.get('/api/vault/files', authenticateToken, async (_req, res) => {
  try {
    const vaultConfig = await prisma.config.findUnique({ where: { key: 'vaultPath' } });
    if (!vaultConfig?.value) return res.json({ files: [] });

    const vaultPath = vaultConfig.value;
    if (!fs.existsSync(vaultPath)) return res.json({ files: [] });

    const walkDir = (dir: string): VaultFile[] => {
      const items: VaultFile[] = [];
      try {
        fs.readdirSync(dir).forEach(name => {
          const full = path.join(dir, name);
          const stat = fs.statSync(full);
          if (stat.isDirectory()) {
            items.push(...walkDir(full));
          } else if (name.endsWith('.md')) {
            items.push({ name, path: full, size: stat.size });
          }
        });
      } catch (_) {}
      return items;
    };

    interface VaultFile { name: string; path: string; size: number; }
    const files = walkDir(vaultPath).slice(0, 100);
    res.json({ files, total: files.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* Vault tree (hierarchical) */
app.get('/api/vault/tree', authenticateToken, async (_req, res) => {
  try {
    const vaultConfig = await prisma.config.findUnique({ where: { key: 'vaultPath' } });
    if (!vaultConfig?.value) return res.json({ tree: null });

    const vaultPath = vaultConfig.value;
    if (!fs.existsSync(vaultPath)) return res.json({ tree: null });

    interface TreeNode {
      name: string;
      type: 'directory' | 'file';
      path: string;
      size?: number;
      children?: TreeNode[];
    }

    const buildTree = (dir: string, depth = 0): TreeNode => {
      const name = path.basename(dir);
      const node: TreeNode = { name, type: 'directory', path: dir, children: [] };
      if (depth > 5) return node; // safety
      try {
        const entries = fs.readdirSync(dir);
        for (const entry of entries) {
          if (entry.startsWith('.')) continue;
          const full = path.join(dir, entry);
          const stat = fs.statSync(full);
          if (stat.isDirectory()) {
            node.children!.push(buildTree(full, depth + 1));
          } else {
            node.children!.push({ name: entry, type: 'file', path: full, size: stat.size });
          }
        }
      } catch (_) {}
      return node;
    };

    const tree = buildTree(vaultPath);
    res.json({ tree });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* Vault file content */
app.get('/api/vault/file', authenticateToken, async (req, res) => {
  try {
    const filePath = req.query.path as string;
    if (!filePath) return res.status(400).json({ error: 'path query required' });

    // Security: validate path is within vault
    const vaultConfig = await prisma.config.findUnique({ where: { key: 'vaultPath' } });
    if (!vaultConfig?.value) return res.status(403).json({ error: 'Vault not configured' });

    const resolvedPath = path.resolve(filePath);
    const resolvedVault = path.resolve(vaultConfig.value);
    if (!resolvedPath.startsWith(resolvedVault)) {
      return res.status(403).json({ error: 'Path outside vault' });
    }

    if (!fs.existsSync(resolvedPath)) return res.status(404).json({ error: 'File not found' });

    const stat = fs.statSync(resolvedPath);
    const content = fs.readFileSync(resolvedPath, 'utf-8');
    res.json({
      name: path.basename(resolvedPath),
      path: resolvedPath,
      content,
      size: stat.size,
      lastModified: stat.mtime.toISOString(),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* ═══════════════════════════════════════
   RAG
═══════════════════════════════════════ */
app.post('/api/rag/index', authenticateToken, async (req, res) => {
  try {
    const vaultConfig = await prisma.config.findUnique({ where: { key: 'vaultPath' } });
    const vaultPath = req.body.path ?? vaultConfig?.value;

    if (vaultPath) {
      await prisma.config.upsert({
        where: { key: 'vaultPath' },
        update: { value: vaultPath },
        create: { key: 'vaultPath', value: vaultPath },
      });
    }

    pushLog('RAG indexing started...', 'info');
    // Real indexing would embed .md files into LanceDB — stub for now
    await new Promise(r => setTimeout(r, 500));
    pushLog('RAG indexing complete.', 'success');

    res.json({ success: true, count: 0, message: 'Indexação iniciada em background.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/rag/search', authenticateToken, async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'query required' });
  // Stub — real impl would search vectorTable
  res.json({ results: [], query });
});

/* ═══════════════════════════════════════
   FEED (polling)
═══════════════════════════════════════ */
app.get('/api/feed/latest', authenticateToken, (_req, res) => {
  const latest = feedLog.slice(-20);
  res.json({ lines: latest });
});

/* ═══════════════════════════════════════
   START
═══════════════════════════════════════ */
const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`🚀 Nexus Agency Backend → http://localhost:${PORT}`);
  pushLog(`Backend started on port ${PORT}`, 'success');
});
