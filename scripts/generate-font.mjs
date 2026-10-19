// Регенерация SDF-шрифта с кириллицей (Roboto).
// Запуск: node scripts/generate-font.mjs
// Входной TTF берётся из solid-tv/solid-demo-app (Roboto, лицензия OFL).
import { execSync } from 'node:child_process';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';

const TTF_URL =
  'https://raw.githubusercontent.com/solid-tv/solid-demo-app/main/public/fonts/Roboto-Regular.ttf';
const TTF_PATH = '.fontgen/Roboto-Regular.ttf';
const CHARSET_PATH = '.fontgen/charset.txt';
const NAME = 'Roboto-Regular';
const OUT_DIR = 'public/fonts';

/** Метрики Roboto-Regular (metrics/Roboto-Regular.metrics.json из demo-app). */
const METRICS = { ascender: 1536, descender: -512, lineGap: 102, unitsPerEm: 2048 };

mkdirSync('.fontgen', { recursive: true });
mkdirSync(OUT_DIR, { recursive: true });

if (!existsSync(TTF_PATH)) {
  console.log('Downloading TTF…');
  const response = await fetch(TTF_URL);
  if (!response.ok) throw new Error(`Failed to download TTF: ${response.status}`);
  writeFileSync(TTF_PATH, Buffer.from(await response.arrayBuffer()));
}

// Набор символов: ASCII + кириллица (U+0400…U+045F) + знаки пунктуации.
const extra = '«»—–…№‘’“”';
const chars = new Set();
for (let code = 32; code <= 126; code++) chars.add(String.fromCharCode(code));
for (let code = 0x0400; code <= 0x045f; code++) chars.add(String.fromCharCode(code));
for (const ch of extra) chars.add(ch);
writeFileSync(CHARSET_PATH, [...chars].join(''));

execSync(
  `npx msdf-bmfont --output-type json -o ${NAME} -s 42 -r 4 -t msdf -m 1024,512 --smart-size --pot -i ${CHARSET_PATH} ${TTF_PATH}`,
  { stdio: 'inherit' },
);

const json = JSON.parse(readFileSync(`${NAME}.json`, 'utf8'));
json.pages = [`${NAME}.msdf.png`];
json.lightningMetrics = METRICS;

writeFileSync(`${OUT_DIR}/${NAME}.msdf.json`, JSON.stringify(json));
copyFileSync(`${NAME}.png`, `${OUT_DIR}/${NAME}.msdf.png`);

console.log(`OK: ${OUT_DIR}/${NAME}.msdf.json + .png`);
