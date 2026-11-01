// Nashrdan oldin: npm token ishlaydimi va `bek-ui` org'iga kirish bormi — aks holda aniq sabab bilan to'xtaydi.
// npm'ning o'z xato kodi (E404 · E403 · E401) logga chiqadi, shunda "org yo'q", "a'zo emas" va "token huquqi yetmaydi"
// bir-biridan ajraladi. Token org a'zolarini o'qiy olmasa (Granular token'da "Organizations: Read" yo'q) — bu
// nashrni to'xtatmaydi: ogohlantirish beriladi va qarorni `npm publish` ning o'zi chiqaradi.
import { execFileSync } from 'node:child_process';

const ORG = 'bek-ui';

const run = (args) =>
  execFileSync('npm', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

/** npm xatosidan qisqa sabab: `npm error code E404` va birinchi izoh qatori. */
const reason = (err) => {
  const text = `${err?.stderr ?? ''}\n${err?.stdout ?? ''}`;
  const code = text.match(/\bcode (E\d{3}|E[A-Z]+)/)?.[1] ?? '';
  const detail =
    text
      .split('\n')
      .map((l) => l.replace(/^npm (error|ERR!)\s*/, '').trim())
      .find((l) => l && !/^code\b/.test(l) && !/complete log/i.test(l)) ?? '';
  return { code, detail };
};

let user;
try {
  user = run(['whoami']);
  console.log(`npm: ${user}`);
} catch (err) {
  const { code, detail } = reason(err);
  console.error(
    `::error::NPM_TOKEN ishlamayapti (yo'q, muddati o'tgan yoki noto'g'ri) — ${code} ${detail}. ` +
      'GitHub → Settings → Secrets → Actions → NPM_TOKEN.',
  );
  process.exit(1);
}

let members;
try {
  members = JSON.parse(run(['org', 'ls', ORG, '--json']) || '{}');
} catch (err) {
  const { code, detail } = reason(err);
  if (code === 'E404') {
    console.error(
      `::error::npm'da \`${ORG}\` tashkiloti topilmadi (${detail}). npmjs.com → Add Organization → "${ORG}" ` +
        `(ochiq paketlar uchun bepul), so'ng ${user} ni Owner qiling.`,
    );
    process.exit(1);
  }
  // E401/E403: token org a'zolarini o'qiy olmaydi — a'zolik bo'lishi ham, bo'lmasligi ham mumkin.
  console.warn(
    `::warning::\`npm org ls ${ORG}\` ruxsat bermadi (${code} ${detail}). Token Granular bo'lsa, unga ` +
      `"Organizations: Read" qo'shing yoki ${user} npmjs.com/org/${ORG}/members da borligini tekshiring. ` +
      'Nashr davom etadi — natijani `npm publish` hal qiladi.',
  );
  process.exit(0);
}

if (!(user in members)) {
  console.error(
    `::error::${user} \`${ORG}\` tashkilotida emas (a'zolar: ${Object.keys(members).join(', ') || "yo'q"}). ` +
      `npmjs.com/org/${ORG}/members → Invite → ${user} (Owner yoki developers jamoasi).`,
  );
  process.exit(1);
}
console.log(`npm org ${ORG}: ${user} — ${members[user]}`);
