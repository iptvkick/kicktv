const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const filesToProcess = [
  'lp-suspensao-lcar-diadema/src/components/sections/LocationSection.tsx',
  'lp-nkam-suspensao-sbc/src/components/sections/LocationSection.tsx',
  'lp-tratocao-sbc/src/components/sections/LocationSection.tsx',
  'lp-jfl-fotos-diadema/src/components/sections/LocationSection.tsx',
  'lp-amigovet-diadema/src/components/sections/LocationSection.tsx',
  'lp-centro-automotivo-aguia-diadema/src/components/sections/LocationSection.tsx'
];

for (const relPath of filesToProcess) {
  const mapFile = path.join(baseDir, relPath);
  if (fs.existsSync(mapFile)) {
    let content = fs.readFileSync(mapFile, 'utf8');

    content = content.replace(/bg-white rounded-\[2rem\]/g, 'bg-zinc-900 rounded-[2rem]');
    content = content.replace(/bg-surface-0 rounded-\[2rem\]/g, 'bg-zinc-900 rounded-[2rem]');
    content = content.replace(/border-border/g, 'border-primary/20');
    content = content.replace(/border border-primary\/10/g, 'border-2 border-primary/20');
    content = content.replace(/ring-1 ring-inset ring-primary\/10/g, ''); // Limpando a ring extra caso haja

    // O iframe tem className="w-full h-full border-0 filter grayscale opacity-90"
    // Vou usar regex para trocar se className estiver no iframe
    content = content.replace(/className="[^"]*grayscale[^"]*"/g, 'className="w-full h-full border-0 mix-blend-luminosity opacity-85"');
    
    // Trocar se o filter estiver inline style (como visto antes)
    content = content.replace(/style={{[^}]*filter:[^}]*}}/g, "style={{ border: 0, mixBlendMode: 'luminosity', opacity: 0.85 }}");

    // E se não tiver nem style nem className className="w-full h-full border-0"?
    // Na dúvida para LocationSection sabemos que alguns usam className="w-full h-full border-0 filter grayscale ... "
    
    fs.writeFileSync(mapFile, content, 'utf8');
    console.log(`Updated ${relPath}`);
  } else {
    console.log(`NOT FOUND ${relPath}`);
  }
}
