const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const projects = [
  'lp-dra-ingrid-diadema',
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

// O Código do badge que vamos colar em src/components/ui/DaviCodeBadge.tsx de cada projeto
const badgeCode = `import { motion } from 'framer-motion';

export const DaviCodeBadge = () => {
  return (
    <div className="text-center text-xs text-text-muted/60 mt-4 pt-4 border-t border-primary/5 w-full flex justify-center pb-2">
      <motion.a 
        href="https://davicode.me" 
        target="_blank" 
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
        whileTap={{ scale: 0.95 }}
      >
        <span>Feito com <span className="text-red-500 animate-pulse">♥</span> por </span >
        <span className="font-medium text-text-main group-hover:text-primary transition-colors">DaviCode</span>
        <motion.span 
          className="inline-block"
          transition={{ duration: 0.2 }}
        >
          <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </motion.span>
      </motion.a>
    </div>
  );
};
`;

for (const project of projects) {
  const compDir = path.join(baseDir, project, 'src', 'components', 'ui');
  if (!fs.existsSync(compDir)) {
    fs.mkdirSync(compDir, { recursive: true });
  }
  
  const badgeFile = path.join(compDir, 'DaviCodeBadge.tsx');
  fs.writeFileSync(badgeFile, badgeCode, 'utf8');

  const appFile = path.join(baseDir, project, 'src', 'App.tsx');
  if (fs.existsSync(appFile)) {
    let appContent = fs.readFileSync(appFile, 'utf8');

    // injetar o import se não houver
    if (!appContent.includes('DaviCodeBadge')) {
      const importStmt = "import { DaviCodeBadge } from './components/ui/DaviCodeBadge';\n";
      // Encontrar último import
      const lastImportMatch = [...appContent.matchAll(/^import.*$/gm)].pop();
      if (lastImportMatch) {
         const insertIndex = lastImportMatch.index + lastImportMatch[0].length;
         appContent = appContent.slice(0, insertIndex) + '\n' + importStmt + appContent.slice(insertIndex);
      } else {
         appContent = importStmt + appContent;
      }

      // Injetar <DaviCodeBadge /> logo antes do fechamento de </footer> ou final de .container mx-auto px-4
      // Melhor ancorar pelo footer copyright
      // A maioria usa: &copy; {new Date().getFullYear()}
      // Vamos plugar depois dessa Tag </p>
      appContent = appContent.replace(/(<p className="[^"]*text-xs text-text-muted[^"]*">.*?<\/p>)(?![\s\S]*<DaviCodeBadge)/is, '$1\n          <DaviCodeBadge />');
      
      fs.writeFileSync(appFile, appContent, 'utf8');
      console.log(`Injected DaviCodeBadge in ${project}/src/App.tsx`);
    } else {
      console.log(`DaviCodeBadge ALREADY in ${project}`);
    }
  }
}
