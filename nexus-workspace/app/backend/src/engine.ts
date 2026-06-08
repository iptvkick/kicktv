import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import os from 'os';
import { EventEmitter } from 'events';
import { randomUUID } from 'crypto';

export interface CommandResult {
  stdout: string;
  stderr: string;
  code: number | null;
}

// Emits 'data' (with type stdout or stderr), 'close', and 'error'
export class ProcessSession extends EventEmitter {
  public id: string;
  private proc: ChildProcessWithoutNullStreams;

  constructor(command: string, args: string[]) {
    super();
    this.id = randomUUID();
    const isWindows = os.platform() === 'win32';
    
    this.proc = spawn(command, args, {
      shell: isWindows,
      stdio: 'pipe',
      env: { ...process.env, FORCE_COLOR: '1' }
    });

    this.proc.stdout.on('data', (data) => {
      this.emit('data', { type: 'stdout', text: data.toString() });
    });

    this.proc.stderr.on('data', (data) => {
      this.emit('data', { type: 'stderr', text: data.toString() });
    });

    this.proc.on('close', (code) => {
      this.emit('close', code);
    });

    this.proc.on('error', (err) => {
      this.emit('error', err);
    });
  }

  public write(input: string) {
    if (this.proc.stdin.writable) {
      this.proc.stdin.write(input + '\n');
    }
  }

  public kill() {
    this.proc.kill();
  }
}

export const processManager = new Map<string, ProcessSession>();

export async function executeCommand(command: string, args: string[]): Promise<CommandResult> {
  return new Promise((resolve, reject) => {
    // Se for windows, garantimos que rodamos via shell para melhor suporte a comandos complexos
    const isWindows = os.platform() === 'win32';
    
    const proc = spawn(command, args, {
      shell: isWindows,
      stdio: 'pipe'
    });

    let stdout = '';
    let stderr = '';

    const timeout = setTimeout(() => {
      if (!proc.killed) {
        proc.kill('SIGKILL');
        resolve({ stdout: '', stderr: 'Timeout - o comando demorou muito.', code: 124 });
      }
    }, 25000); // 25s timeout per strategy

    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      clearTimeout(timeout);
      resolve({ stdout, stderr, code });
    });

    proc.on('error', (err) => {
      clearTimeout(timeout);
      resolve({ stdout: '', stderr: err.message, code: 1 });
    });
  });
}

/**
 * Runs the Gemini CLI in non-interactive mode.
 * Tries multiple invocation strategies and checks both stdout and stderr for output.
 */
export async function runGeminiCli(systemPrompt: string | null | undefined, userPrompt: string): Promise<CommandResult> {
  const combinedPrompt = systemPrompt
    ? `${systemPrompt}\n\nUsuário: ${userPrompt}`
    : userPrompt;

  // Strategy 1: gemini -p "prompt"  (globally installed @google/gemini-cli)
  try {
    const res = await executeCommand('gemini', ['-p', combinedPrompt]);
    const output = (res.stdout || res.stderr || '').trim();
    if (output.length > 0) {
      return { stdout: output, stderr: '', code: 0 };
    }
  } catch (_) {}

  // Strategy 2: gemini --prompt "prompt"
  try {
    const res = await executeCommand('gemini', ['--prompt', combinedPrompt]);
    const output = (res.stdout || res.stderr || '').trim();
    if (output.length > 0) {
      return { stdout: output, stderr: '', code: 0 };
    }
  } catch (_) {}

  // Strategy 3: npx @google/gemini-cli (last resort, slower)
  try {
    const res = await executeCommand('npx', ['-y', '@google/gemini-cli', '-p', combinedPrompt]);
    const output = (res.stdout || res.stderr || '').trim();
    if (output.length > 0) {
      return { stdout: output, stderr: '', code: 0 };
    }
  } catch (_) {}

  // Fallback: offline mode
  return {
    stdout: `[Modo Offline]\n\nNão foi possível conectar ao Gemini CLI.\n\nSua mensagem foi recebida: "${userPrompt}"\n\n*Configure o gemini-cli globalmente: \`npm install -g @google/gemini-cli\` e autentique com \`gemini auth\`.*`,
    stderr: '',
    code: 0,
  };
}
