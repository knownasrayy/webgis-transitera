/**
 * Local Secret & Security Scanner (TransitERA SEC-A4)
 * Run: node scripts/scan-secrets.js
 */

const fs = require('fs');
const path = require('path');

const IGNORED_DIRS = ['node_modules', '.next', '.git', 'out', 'dist', 'build', '.agents', '.pytest_cache', '__pycache__'];
const IGNORED_FILES = ['package-lock.json', '.env.example', 'scan-secrets.js', 'notulensi-AI.txt', 'MAPID_Data_Catalog.md'];

// Regex patterns to detect high-entropy keys, Google API keys, OpenAI keys, MAPID keys, etc.
const SECRET_PATTERNS = [
  { name: 'Google API Key', regex: /AIza[0-9A-Za-z_-]{35}/g },
  { name: 'OpenAI Secret Key', regex: /sk-[a-zA-Z0-9]{32,}/g },
  { name: 'Generic Hardcoded Secret/Token', regex: /(?:api_key|apiKey|secret_key|private_key)\s*[:=]\s*['"][a-zA-Z0-9_\-]{20,}['"]/gi },
  { name: 'Postgres Auth URI with Password', regex: /postgresql?:\/\/[a-zA-Z0-9_-]+:[a-zA-Z0-9_!@#$%^&*()+=]+@[a-zA-Z0-9.-]+:[0-9]+\/[a-zA-Z0-9_-]+/g },
];

let issuesFound = 0;

function scanDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.includes(entry.name)) {
        scanDirectory(fullPath);
      }
    } else if (entry.isFile()) {
      if (IGNORED_FILES.includes(entry.name)) continue;

      const ext = path.extname(entry.name).toLowerCase();
      if (['.png', '.jpg', '.jpeg', '.svg', '.webp', '.ico', '.woff', '.woff2', '.ttf', '.tsbuildinfo'].includes(ext)) {
        continue;
      }

      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const lines = content.split('\n');

        lines.forEach((line, idx) => {
          for (const pattern of SECRET_PATTERNS) {
            if (pattern.regex.test(line)) {
              // Ignore matches in comments or mock placeholders
              if (line.includes('your_') || line.includes('placeholder') || line.includes('YOUR_')) continue;

              console.error(`\x1b[31m[LEAK DETECTED]\x1b[0m ${pattern.name} in ${fullPath}:${idx + 1}`);
              console.error(`  Line: ${line.trim().substring(0, 100)}`);
              issuesFound++;
            }
          }
        });
      } catch (err) {
        // skip unreadable binary files
      }
    }
  }
}

console.log('🔍 Running TransitERA Secret Scanner...');
scanDirectory(process.cwd());

if (issuesFound > 0) {
  console.error(`\n❌ Found ${issuesFound} potential secret leak(s)! Please sanitize before committing.`);
  process.exit(1);
} else {
  console.log('✅ Clean! No leaked API keys or secrets detected.');
  process.exit(0);
}
