const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

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

console.log('Starting global push process...');

for (const project of projects) {
  const projectPath = path.join(baseDir, project);
  if (!fs.existsSync(projectPath)) {
    console.log(`Skipping ${project} - directory not found.`);
    continue;
  }

  console.log(`\n================================`);
  console.log(`Pushing ${project}`);
  console.log(`================================`);

  try {
    const status = execSync('git status --porcelain', { cwd: projectPath, encoding: 'utf8' });
    if (!status.trim()) {
      console.log(`No changes to commit in ${project}.`);
      continue;
    }

    console.log('Committing and Pushing...');
    execSync('git add -A', { cwd: projectPath });
    execSync('git commit -m "style: global refinements (map contrast, DaviCode footer injection)"', { cwd: projectPath });
    execSync('git push origin main', { cwd: projectPath, stdio: 'inherit' });
    
    console.log(`✅ Success: ${project}`);
  } catch (err) {
    console.error(`❌ Failed on ${project}`);
    console.error(err.message);
  }
}
