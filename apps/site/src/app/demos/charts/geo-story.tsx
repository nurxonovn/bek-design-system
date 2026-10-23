import { useState, type ComponentType, type ReactNode } from 'react';
import {
  ChartContainer,
  DrawTheLine,
  Pictogram,
  RaceChart,
  RegionMap,
  SurveyChart,
  formatNumber,
  type DrawPoint,
  type RaceFrame,
  type RegionDatum,
  type UzRegionId,
} from '@bek-ui/charts';

// Chart demolari (geo-story): region-map, race-chart, draw-the-line, survey-chart, pictogram.

const Stack = ({ children, wide = false }: { children: ReactNode; wide?: boolean }) => (
  <div className={`flex flex-col gap-6 w-full ${wide ? 'max-w-3xl' : 'max-w-xl'}`}>{children}</div>
);

const Caption = ({ children }: { children: ReactNode }) => (
  <p className="text-sm" style={{ color: 'var(--bek-text-secondary)', margin: 0 }}>
    {children}
  </p>
);

/* ---------- region-map ---------- */

// Namunaviy ma'lumot (illyustratsiya): mobil banking foydalanuvchilari, kattalar ulushi %.
const MOBILE_BANKING: Record<UzRegionId, number> = {
  'UZ-TK': 82,
  'UZ-TO': 68,
  'UZ-AN': 61,
  'UZ-FA': 59,
  'UZ-NG': 57,
  'UZ-SA': 55,
  'UZ-BU': 52,
  'UZ-NW': 54,
  'UZ-SI': 47,
  'UZ-JI': 44,
  'UZ-XO': 46,
  'UZ-QA': 41,
  'UZ-SU': 38,
  'UZ-QR': 33,
};
// Aholi, mln (taxminiy, 2025).
const POPULATION: Record<UzRegionId, number> = {
  'UZ-SA': 4.2,
  'UZ-FA': 4.1,
  'UZ-QA': 3.6,
  'UZ-AN': 3.4,
  'UZ-TK': 3.0,
  'UZ-TO': 3.0,
  'UZ-NG': 3.0,
  'UZ-SU': 2.9,
  'UZ-BU': 2.0,
  'UZ-QR': 2.0,
  'UZ-XO': 1.9,
  'UZ-JI': 1.5,
  'UZ-NW': 1.1,
  'UZ-SI': 0.9,
};
const toData = (m: Record<string, number>): RegionDatum[] =>
  Object.entries(m).map(([region, value]) => ({ region, value }));

function RegionMapDemo() {
  const [selected, setSelected] = useState<UzRegionId | null>(null);
  return (
    <Stack>
      <ChartContainer>
        {(width) => (
          <RegionMap
            width={width}
            data={toData(MOBILE_BANKING)}
            metric="Mobil banking, kattalar %"
            formatValue={(v) => `${v}%`}
            selected={selected}
            onSelectChange={setSelected}
            label="Mobil banking: eng yuqori Toshkent sh. 82%, eng past Qoraqalpog‘iston 33%"
          />
        )}
      </ChartContainer>
      <Caption>
        {selected
          ? `Tanlangan: ${selected}. Qayta bosing yoki Escape — bekor qilish.`
          : 'Hududni bosing yoki Tab bilan tanlang; strelkalar — qo‘shni hudud.'}
      </Caption>
      <ChartContainer>
        {(width) => (
          <RegionMap
            width={width}
            variant="bubble"
            data={toData(POPULATION)}
            metric="aholi, mln"
            formatValue={(v) => `${formatNumber(v, { decimals: 1 })} mln`}
            label="Aholi: eng ko‘p Samarqand 4,2 mln, eng kam Sirdaryo 0,9 mln"
          />
        )}
      </ChartContainer>
      <ChartContainer>
        {(width) => (
          <RegionMap
            width={width}
            variant="hex"
            data={toData(MOBILE_BANKING)}
            formatValue={(v) => `${v}%`}
            label="Mobil banking, teng plitkalar: Toshkent sh. va Toshkent viloyati eng yuqori"
          />
        )}
      </ChartContainer>
      <Caption>Xarita: svg-maps (V. Cazanave), CC BY 4.0.</Caption>
    </Stack>
  );
}

/* ---------- race-chart ---------- */

const COURSES: Record<string, number[]> = {
  'UX/UI': [8, 12, 17, 23, 30, 48, 52, 58],
  Frontend: [14, 17, 22, 27, 34, 42, 45, 49],
  Data: [3, 6, 11, 18, 26, 37, 44, 51],
  Python: [10, 14, 19, 24, 28, 33, 36, 38],
  English: [20, 22, 24, 25, 27, 29, 30, 31],
  Marketing: [12, 13, 15, 17, 19, 21, 22, 23],
  SMM: [6, 9, 12, 14, 16, 18, 19, 20],
};
const YEARS = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];
const RACE: RaceFrame[] = YEARS.map((period, i) => ({
  period,
  values: Object.entries(COURSES).map(([name, v]) => ({ name, value: v[i] })),
}));

function RaceChartDemo() {
  return (
    <Stack>
      <ChartContainer>
        {(width) => (
          <RaceChart
            width={width}
            frames={RACE}
            defaultFrame={5}
            formatValue={(v) => `${v}k`}
            label="Kurslar mashhurligi 2019–2026: 2021 dan UX/UI yetakchi, Data tez o‘smoqda"
          />
        )}
      </ChartContainer>
      <ChartContainer>
        {(width) => (
          <RaceChart
            width={width}
            variant="line"
            frames={RACE}
            defaultFrame={5}
            top={4}
            formatValue={(v) => `${v}k`}
            label="Jamlanma o‘sish: UX/UI, Frontend, Data va English chiziqlari 2024 gacha"
          />
        )}
      </ChartContainer>
      <Caption>Play bosilmaguncha o‘ynamaydi; progress’da ←/→, Home/End.</Caption>
    </Stack>
  );
}

/* ---------- draw-the-line ---------- */

const LEARNERS: DrawPoint[] = [12, 15, 19, 24, 31, 38, 47, 52].map((y, i) => ({
  x: 2019 + i,
  y,
}));

function DrawTheLineDemo() {
  const [result, setResult] = useState<string>('');
  return (
    <Stack>
      <ChartContainer>
        {(width) => (
          <DrawTheLine
            width={width}
            data={LEARNERS}
            revealFrom={2022}
            formatValue={(v) => `${Math.round(v)}k`}
            onReveal={(guess) =>
              setResult(guess.length ? `Taxmin: ${guess.length} nuqta` : 'Taxminsiz ochildi')
            }
            hint="Davomini chizing →"
            actualLabel="Haqiqiy"
            guessLabel="Sizning taxminingiz"
            revealLabel="Ko‘rsatish"
            skipLabel="O‘tkazib yuborish"
            youLabel="siz"
            label="BEK Academy o‘quvchilari 2019–2022 (ming); 2026 gacha davomini taxmin qiling"
          />
        )}
      </ChartContainer>
      {result && <Caption>{result}</Caption>}
      <ChartContainer>
        {(width) => (
          <DrawTheLine
            width={width}
            data={LEARNERS}
            revealFrom={2022}
            variant="reveal"
            defaultGuess={[28, 32, 36, 40]}
            formatValue={(v) => `${Math.round(v)}k`}
            actualLabel="Haqiqiy"
            guessLabel="Sizning taxminingiz"
            youLabel="siz"
            label="Haqiqiy 52 ming, taxmin 40 ming: o‘sish kutilganidan tez"
          />
        )}
      </ChartContainer>
    </Stack>
  );
}

/* ---------- survey-chart ---------- */

const FEEDBACK = [
  { label: 'Darslar tushunarli', counts: [4, 8, 14, 44, 30] },
  { label: 'Mentor yordami', counts: [6, 10, 20, 38, 26] },
  { label: 'Kurs tezligi', counts: [10, 16, 28, 32, 14] },
  { label: 'Narx va qiymat', counts: [12, 18, 40, 20, 10] },
  { label: 'Tavsiya qilaman', counts: [2, 4, 10, 40, 44] },
];
const SCALE_UZ = ['Mutlaqo qarshi', 'Qarshi', 'Betaraf', 'Rozi', 'Mutlaqo rozi'];

function SurveyChartDemo() {
  return (
    <Stack>
      <ChartContainer>
        {(width) => (
          <SurveyChart
            width={width}
            scale={SCALE_UZ}
            questions={FEEDBACK}
            axisLabels={['← Qarshi', 'Rozi →']}
            label="5 savol: eng yuqori — Tavsiya qilaman (Net +78), eng past — Narx va qiymat (Net 0)"
          />
        )}
      </ChartContainer>
      <ChartContainer>
        {(width) => (
          <SurveyChart
            width={width}
            variant="net"
            sort="net"
            scale={SCALE_UZ}
            questions={FEEDBACK}
            axisLabels={['← Qarshi', 'Rozi →']}
            netLabels={['Net rozi (rozi − qarshi)', 'Net qarshi']}
            label="Net bo‘yicha saralangan: Tavsiya qilaman birinchi, Narx va qiymat oxirgi"
          />
        )}
      </ChartContainer>
    </Stack>
  );
}

/* ---------- pictogram ---------- */

function PictogramDemo() {
  return (
    <Stack>
      <Pictogram
        value={0.3}
        total={20}
        headline="10 tadan 3"
        unit="o‘quvchilar"
        caption="birinchi kursni bir oyda tugatadi"
        unitLabel="1 ikonka = o‘quvchilarning 5%"
        label="10 tadan 3 o‘quvchi birinchi kursni bir oyda tugatadi"
      />
      <Pictogram
        variant="compare"
        unit="o‘quvchilar"
        unitLabel="1 ikonka = o‘quvchilarning 10%"
        rows={[
          { label: '2020', value: 0.2, n: 840 },
          { label: '2026', value: 0.55, n: 2310 },
        ]}
        label="Kursni tugatganlar: 2020 — 20%, 2026 — 55%"
      />
    </Stack>
  );
}

export const chartDemosGeoStory: Record<string, ComponentType> = {
  'region-map': RegionMapDemo,
  'race-chart': RaceChartDemo,
  'draw-the-line': DrawTheLineDemo,
  'survey-chart': SurveyChartDemo,
  pictogram: PictogramDemo,
};
