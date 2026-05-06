const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const replacements = [
  // Backgrounds
  { regex: /bg-\[#050816\]/g, replacement: 'bg-[var(--color-bg-primary)]' },
  { regex: /bg-\[#0B0F2A\]/g, replacement: 'bg-[var(--color-bg-secondary)]' },
  { regex: /bg-\[#111338\]/g, replacement: 'bg-[var(--color-bg-tertiary)]' },
  { regex: /bg-\[#0d1025\]/g, replacement: 'bg-[var(--color-surface)]' },
  { regex: /bg-\[#161940\]/g, replacement: 'bg-[var(--color-surface-hover)]' },
  { regex: /bg-gradient-to-b from-\[#050816\] via-\[#0B0F2A\] to-\[#050816\]/g, replacement: 'bg-gradient-to-b from-[var(--color-bg-primary)] via-[var(--color-bg-secondary)] to-[var(--color-bg-primary)]' },
  { regex: /from-\[#050816\]/g, replacement: 'from-[var(--color-bg-primary)]' },
  { regex: /via-\[#0B0F2A\]/g, replacement: 'via-[var(--color-bg-secondary)]' },
  { regex: /to-\[#050816\]/g, replacement: 'to-[var(--color-bg-primary)]' },
  
  // Opacity versions
  { regex: /bg-\[#050816\]\/([0-9]+)/g, replacement: 'bg-[var(--color-bg-primary)]' }, // Let's keep it simple
  
  // Specific Accent
  { regex: /\[#7C3AED\]/g, replacement: '[#6366F1]' },
  { regex: /\[#6D28D9\]/g, replacement: '[#4F46E5]' },

  // Text Colors
  { regex: /text-white\/([0-9]+)/g, replacement: 'text-[var(--color-text-primary)]' },
  { regex: /text-white/g, replacement: 'text-[var(--color-text-primary)]' },
  { regex: /text-gray-400/g, replacement: 'text-[var(--color-text-muted)]' },
  { regex: /text-gray-300/g, replacement: 'text-[var(--color-text-secondary)]' },
  { regex: /text-\[#9CA3AF\]/g, replacement: 'text-[var(--color-text-secondary)]' },
  { regex: /text-\[#6B7280\]/g, replacement: 'text-[var(--color-text-muted)]' },

  // Borders & White opacities -> Black opacities for light mode (except where obvious)
  { regex: /bg-white\/5/g, replacement: 'bg-black/5' },
  { regex: /bg-white\/10/g, replacement: 'bg-black/10' },
  { regex: /bg-white\/\[0\.03\]/g, replacement: 'bg-black/[0.03]' },
  { regex: /border-white\/5/g, replacement: 'border-black/5' },
  { regex: /border-white\/10/g, replacement: 'border-black/10' },
  { regex: /border-white\/15/g, replacement: 'border-black/15' },
  { regex: /border-white\/\[0\.04\]/g, replacement: 'border-black/[0.04]' },
  { regex: /border-white\/\[0\.05\]/g, replacement: 'border-black/[0.05]' },
  { regex: /hover:bg-white\/5/g, replacement: 'hover:bg-black/5' },
  { regex: /hover:text-white/g, replacement: 'hover:text-[var(--color-accent)]' },

  // Ring/Shadows
  { regex: /border-white\/20/g, replacement: 'border-black/10' }
];

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;

      replacements.forEach(({ regex, replacement }) => {
        content = content.replace(regex, replacement);
      });

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  });
}

processDirectory(directoryPath);
console.log('Replacement complete.');
