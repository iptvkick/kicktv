const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const projects = [
  { id: 'dra-ingrid',  url: 'https://draingrid.davicode.me' },
  { id: 'nkam',        url: 'https://nkam.davicode.me' },
  { id: 'tratocao',    url: 'https://tratocao.davicode.me' },
  { id: 'jac-motors',  url: 'https://jacmotors.davicode.me' },
  { id: 'recam',       url: 'https://recam.davicode.me' },
  { id: 'india',       url: 'https://india.davicode.me' },
  { id: 'japones',     url: 'https://japones.davicode.me' },
  { id: 'amigovet',    url: 'https://amigovet.davicode.me' },
  { id: 'lcar',        url: 'https://lcar.davicode.me' },
  { id: 'aguia',       url: 'https://aguia.davicode.me' }
];

const workspaceRoot = 'C:\\Users\\User\\Desktop\\vscode\\projetos antigravity';
const outputDir = path.join(workspaceRoot, 'portfolio-davicode', 'public', 'mockups');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function capture() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Iniciando capturas dos sites ao vivo...');

  for (const project of projects) {
    console.log(`Acessando ${project.url}...`);
    try {
      await page.goto(project.url, { waitUntil: 'networkidle0', timeout: 30000 });
      // Aguarda animações entrarem
      await new Promise(r => setTimeout(r, 2500));
      const outPath = path.join(outputDir, `${project.id}.png`);
      await page.screenshot({ path: outPath });
      console.log(`✓ Salvo: mockups/${project.id}.png`);
    } catch (err) {
      console.error(`✗ Erro ao capturar ${project.id}:`, err.message);
    }
  }

  await browser.close();
  console.log('\nCaptura finalizada!');
}

capture().catch(console.error);
