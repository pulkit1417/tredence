const fs = require('fs');
const path = require('path');

const traverse = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      content = content.replace(/'#334155'/gi, "'var(--text-primary)'");
      content = content.replace(/'#475569'/gi, "'var(--text-secondary)'");
      content = content.replace(/'#94a3b8'/gi, "'var(--text-secondary)'");

      // Custom fix for other embedded cases
      content = content.replace(/color: '#334155'/gi, "color: 'var(--text-primary)'");
      content = content.replace(/color: '#475569'/gi, "color: 'var(--text-secondary)'");
      content = content.replace(/color: '#94a3b8'/gi, "color: 'var(--text-secondary)'");
      
      // Fix buttons with fixed bright borders
      content = content.replace(/'#e2e8f0'/gi, "'var(--border-medium)'");

      fs.writeFileSync(fullPath, content);
    }
  }
};

traverse('./src');
console.log('Fixed secondary invisible colors!');
