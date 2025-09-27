import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

// destination directory for the boilerplate
const dest = path.resolve(process.cwd(), 'boilerplate');

// clean previous output
fs.rmSync(dest, { recursive: true, force: true });
fs.mkdirSync(dest, { recursive: true });

// copy tracked files using git archive to preserve ignore rules
execSync(`git archive HEAD | tar -x -C ${dest}`);

// remove files/directories that are specific to tweakcn and not needed for a generic AI SaaS starter
const removePaths = [
  'app/editor',
  'app/figma',
  'app/themes',
  'app/r',
  'app/not-found.tsx',
  'app/apple-touch-icon.png',
  'app/favicon-16x16.png',
  'app/favicon-32x32.png',
  'app/favicon.ico',
  'assets',
  'public/og-image.v050725.png',
  'public/favicon-16x16.png',
  'public/favicon-32x32.png',
  'public/apple-touch-icon.png',
  'scripts/generate-theme-registry.ts',
  'scripts/generate-registry.ts'
];

for (const rel of removePaths) {
  const p = path.join(dest, rel);
  fs.rmSync(p, { recursive: true, force: true });
}

// write minimal README for the generated boilerplate
const readme = `# AI SaaS Boilerplate\n\nThis folder was generated from the main project using \`scripts/create-boilerplate.ts\`.\nIt keeps authentication, billing, rate-limited AI endpoints and other reusable pieces while\ntrimming theme-editor specific code.\n`;
fs.writeFileSync(path.join(dest, 'README.md'), readme);

console.log(`Boilerplate generated at ${dest}`);
