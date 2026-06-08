const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const projects = [
  'lp-amigovet-diadema',
  'lp-mecanica-india-diadema',
  'lp-mecanica-japones-diadema',
  'lp-nkam-suspensao-sbc',
  'lp-oficina-jac-motors-diadema',
  'lp-recam-amortecedores-diadema',
  'lp-centro-automotivo-aguia-diadema',
  'lp-suspensao-lcar-diadema',
  'lp-tratocao-sbc'
];

for (const project of projects) {
  const appFile = path.join(baseDir, project, 'src', 'App.tsx');
  if (fs.existsSync(appFile)) {
    let appContent = fs.readFileSync(appFile, 'utf8');

    appContent = appContent.replace(/<DaviCodeBadge \/>/g, '');
    
    // Ancoragem mais forte
    if (appContent.includes('</footer>')) {
        appContent = appContent.replace('</footer>', '  <DaviCodeBadge />\n      </footer>');
    } else {
        appContent = appContent.replace('</main>', '  <DaviCodeBadge />\n    </main>');
    }

    fs.writeFileSync(appFile, appContent, 'utf8');
    console.log(`Re-injected DaviCodeBadge in ${project}/src/App.tsx`);
  }
}
