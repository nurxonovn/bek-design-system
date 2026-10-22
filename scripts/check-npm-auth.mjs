// Nashrdan oldin: npm token ishlaydimi va `bek-ui` org'iga kirish bormi — aks holda aniq xato bilan to'xtaydi.
import { execFileSync } from 'node:child_process';

const run = (args) =>
  execFileSync('npm', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

try {
  console.log(`npm: ${run(['whoami'])}`);
} catch {
  console.error(
    "::error::NPM_TOKEN ishlamayapti (yo'q, muddati o'tgan yoki noto'g'ri). GitHub → Settings → Secrets → NPM_TOKEN.",
  );
  process.exit(1);
}
try {
  run(['org', 'ls', 'bek-ui']);
} catch {
  console.error(
    "::error::Token egasi npm'dagi `bek-ui` org'ida emas — npmjs.com/org/bek-ui/members ga qo'shing.",
  );
  process.exit(1);
}
