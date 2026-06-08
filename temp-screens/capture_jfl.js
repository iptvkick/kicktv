const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const outputDir = 'C:\\Users\\User\\Desktop\\vscode\\projetos antigravity\\portfolio-davicode\\public\\mockups';

async function capture() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://jfl.davicode.me', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(outputDir, 'jfl-fotos.png') });
  console.log('✓ Salvo: mockups/jfl-fotos.png');
  await browser.close();
}

capture().catch(console.error);
