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
      content = content.replace(/'#ffffff'/gi, "'var(--bg-panel)'");
      content = content.replace(/'#fff'/gi, "'var(--bg-panel)'");
      content = content.replace(/'#f8fafc'/gi, "'var(--bg-app)'");
      content = content.replace(/'#1e293b'/gi, "'var(--text-primary)'");
      content = content.replace(/'#64748b'/gi, "'var(--text-secondary)'");
      content = content.replace(/'#475569'/gi, "'var(--text-secondary)'");
      content = content.replace(/'#e2e8f0'/gi, "'var(--border-medium)'");
      content = content.replace(/'#f1f5f9'/gi, "'var(--border-light)'");
      content = content.replace(/'#cbd5e1'/gi, "'var(--border-dark)'");
      
      // Fix background hardcode cases inside strings/objects
      content = content.replace(/background: '#ffffff'/gi, "background: 'var(--bg-panel)'");
      content = content.replace(/background: '#fff'/gi, "background: 'var(--bg-panel)'");
      content = content.replace(/background: '#f8fafc'/gi, "background: 'var(--bg-app)'");
      content = content.replace(/color: '#1e293b'/gi, "color: 'var(--text-primary)'");
      content = content.replace(/color: '#64748b'/gi, "color: 'var(--text-secondary)'");
      
      fs.writeFileSync(fullPath, content);
    }
  }
};

traverse('./src');
console.log('Global CSS variable tokens injected everywhere!');
