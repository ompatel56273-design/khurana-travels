const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const replacements = [
  // Primary buttons or icons inside gradients should remain white
  { regex: /from-\[#6366F1\] to-\[#4F46E5\] text-\[var\(--color-text-primary\)\]/g, replacement: 'from-[#6366F1] to-[#4F46E5] text-white' },
  { regex: /from-\[#6366F1\] to-\[#6D28D9\] text-\[var\(--color-text-primary\)\]/g, replacement: 'from-[#6366F1] to-[#4F46E5] text-white' },
  { regex: /text-\[var\(--color-text-primary\)\](.*?)bg-gradient/g, replacement: 'text-white$1bg-gradient' }, // This might be risky, but let's stick to specific patterns
  
  // Specific fix for the Bus Icon in Navbar
  { regex: /from-\[#6366F1\] to-\[#4F46E5\].*?<IoBus className="text-\[var\(--color-text-primary\)\]/gs, replacement: 'from-[#6366F1] to-[#4F46E5] flex items-center justify-center shadow-lg shadow-[#6366F1]/20 group-hover:shadow-[#6366F1]/40 transition-all duration-500">\n                <IoBus className="text-white' },

  // Dark glass cards fixes
  { regex: /bg-white\/\[0\.04\]/g, replacement: 'bg-[var(--color-surface)]' },
  { regex: /border-white\/\[0\.08\]/g, replacement: 'border-black/[0.08]' },
  { regex: /shadow-\[0_4px_30px_rgba\(0,0,0,0\.3\)\]/g, replacement: 'shadow-[0_4px_30px_rgba(0,0,0,0.05)]' }, // lighter shadow
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
        console.log(`Updated touchups: ${fullPath}`);
      }
    }
  });
}

processDirectory(directoryPath);
console.log('Touchups complete.');
