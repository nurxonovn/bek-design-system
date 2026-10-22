import type { ComponentType, ReactNode } from 'react';
import {
  BeeswarmChart,
  CalendarHeatmap,
  CandlestickChart,
  ChartContainer,
  ClusterMap,
  CohortHeatmap,
  FunnelChart,
  GaugeChart,
  ModelComparison,
  NetworkGraph,
  RadarChart,
  SankeyChart,
  ScatterChart,
  TreemapChart,
  WaffleChart,
  WaterfallChart,
  formatNumber,
  type BeeswarmDatum,
  type CalendarDay,
  type Candle,
  type ClusterPoint,
  type ScatterPoint,
} from '@bek-ui/charts';

// Chart demolari (c): calendar-heatmap, treemap-chart, waffle-chart, funnel-chart, waterfall-chart, sankey-chart, radar-chart, scatter-chart, beeswarm-chart, network-graph, candlestick-chart, cohort-heatmap, gauge-chart, cluster-map, model-comparison.
// Ma'lumotlar statik va deterministik (Math.random / Date.now yo'q) — SSR, skrinshot va e2e bir xil.

const Stack = ({ children, wide = false }: { children: ReactNode; wide?: boolean }) => (
  <div className={`flex flex-col gap-6 w-full ${wide ? 'max-w-3xl' : 'max-w-xl'}`}>{children}</div>
);

const UZ_MONTHS = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn', 'Iyl', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];
const UZ_WEEKDAYS = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];

/* ---------- calendar-heatmap ---------- */

const CALENDAR_DAYS: CalendarDay[] = Array.from({ length: 304 }, (_, i) => {
  const d = new Date(Date.UTC(2026, 0, 1 + i));
  const weekday = (d.getUTCDay() + 6) % 7; // 0 = dushanba
  const weekend = weekday >= 5;
  const seasonal = 10 + Math.round(8 * Math.sin((i / 365) * 2 * Math.PI));
  const wave = (i * 7) % 11;
  const value = weekend ? (i % 4 === 0 ? 0 : wave % 5) : seasonal + wave;
  return { date: d.toISOString().slice(0, 10), value };
});

function CalendarHeatmapDemo() {
  return (
    <Stack wide>
      <ChartContainer>
        {(width) => (
          <CalendarHeatmap
            variant="year"
            width={width}
            data={CALENDAR_DAYS}
            year={2026}
            bins={[0, 5, 12, 20]}
            unit="toʻlov"
            monthLabels={UZ_MONTHS}
            weekdayLabels={UZ_WEEKDAYS}
            label="2026-yil kunlik toʻlovlar: ish kunlari faol, dam olish kunlari kam"
          />
        )}
      </ChartContainer>
      <CalendarHeatmap
        variant="month"
        data={CALENDAR_DAYS}
        year={2026}
        month={10}
        bins={[0, 5, 12, 20]}
        unit="toʻlov"
        monthLabels={UZ_MONTHS}
        weekdayLabels={UZ_WEEKDAYS}
        label="Oktabr 2026 kunlik toʻlovlar: hafta oʻrtasida eng koʻp"
      />
    </Stack>
  );
}

/* ---------- treemap-chart ---------- */

const BUDGET = {
  name: 'Oylik byudjet',
  children: [
    { name: 'Oziq-ovqat', value: 38 },
    {
      name: 'Transport',
      children: [
        { name: 'Taksi', value: 14 },
        { name: 'Metro', value: 8 },
      ],
    },
    { name: 'Kommunal', value: 16 },
    {
      name: 'Koʻngilochar',
      children: [
        { name: 'Kino', value: 5 },
        { name: 'Kafe', value: 7 },
      ],
    },
    { name: 'Taʼlim', value: 9 },
    { name: 'Sogʻliq', value: 6 },
    { name: 'Kiyim', value: 4 },
    { name: 'Sovgʻalar', value: 3 },
  ],
};

function TreemapChartDemo() {
  return (
    <Stack>
      <ChartContainer>
        {(width) => (
          <TreemapChart
            width={width}
            data={BUDGET}
            limit={6}
            otherLabel="Boshqa"
            formatValue={(v) => `${formatNumber(v)}%`}
            label="Oylik byudjet: eng katta ulush oziq-ovqatga, keyin transport va kommunal"
          />
        )}
      </ChartContainer>
    </Stack>
  );
}

/* ---------- waffle-chart ---------- */

function WaffleChartDemo() {
  return (
    <div className="flex flex-wrap gap-8">
      <WaffleChart
        data={[
          { label: 'Mobil ilova', share: 0.46 },
          { label: 'Veb-sayt', share: 0.28 },
          { label: 'Filial', share: 0.16 },
        ]}
        remainderLabel="Boshqa"
        label="Buyurtmalar kanali: 46 foiz mobil ilova, 28 foiz veb-sayt, 16 foiz filial, 10 foiz boshqa"
      />
      <WaffleChart
        cellSize={12}
        data={[{ label: 'Rejadan bajarilgan', share: 0.72 }]}
        remainderLabel="Qolgan"
        label="Choraklik reja 72 foiz bajarildi, 28 foiz qoldi"
      />
    </div>
  );
}

/* ---------- funnel-chart ---------- */

const SIGNUP_STEPS = [
  { label: 'Tashrif', value: 12400 },
  { label: 'Roʻyxatdan oʻtdi', value: 5210 },
  { label: 'Tasdiqladi', value: 3880 },
  { label: 'Karta qoʻshdi', value: 2140 },
  { label: 'Birinchi toʻlov', value: 1720 },
];

function FunnelChartDemo() {
  return (
    <Stack>
      <ChartContainer>
        {(width) => (
          <FunnelChart
            variant="stepped"
            width={width}
            steps={SIGNUP_STEPS}
            highlightDrop
            formatValue={(v) => formatNumber(v)}
            label="Roʻyxatdan oʻtish voronkasi: eng katta tushish birinchi tashrifdan keyin"
          />
        )}
      </ChartContainer>
      <ChartContainer>
        {(width) => (
          <FunnelChart
            variant="horizontal"
            width={width}
            steps={SIGNUP_STEPS}
            formatValue={(v) => formatNumber(v)}
            label="Tashrifdan birinchi toʻlovgacha 14 foiz yetib boradi"
          />
        )}
      </ChartContainer>
    </Stack>
  );
}

/* ---------- waterfall-chart ---------- */

function WaterfallChartDemo() {
  return (
    <Stack>
      <ChartContainer>
        {(width) => (
          <WaterfallChart
            width={width}
            start={{ label: '1-chorak', value: 60 }}
            items={[
              { label: 'Savdo', value: 18 },
              { label: 'Xizmatlar', value: 7 },
              { label: 'Qaytarish', value: -14 },
              { label: 'Soliq', value: -6 },
            ]}
            end={{ label: '2-chorak' }}
            legendLabels={{ increase: 'Oʻsish', decrease: 'Kamayish', total: 'Jami' }}
            formatValue={(v) => formatNumber(v)}
            label="Daromad, mln soʻm: 1-chorak 60, savdo +18, xizmatlar +7, qaytarish −14, soliq −6, 2-chorak 65"
          />
        )}
      </ChartContainer>
    </Stack>
  );
}

/* ---------- sankey-chart ---------- */

function SankeyChartDemo() {
  return (
    <Stack>
      <ChartContainer>
        {(width) => (
          <SankeyChart
            width={width}
            nodes={[
              { id: 'salary', label: 'Maosh' },
              { id: 'freelance', label: 'Frilans' },
              { id: 'spent', label: 'Xarajat' },
              { id: 'saved', label: 'Jamgʻarma' },
              { id: 'rent', label: 'Ijara' },
              { id: 'food', label: 'Oziq-ovqat' },
              { id: 'transport', label: 'Transport' },
              { id: 'deposit', label: 'Omonat' },
            ]}
            links={[
              { source: 'salary', target: 'spent', value: 9 },
              { source: 'salary', target: 'saved', value: 3 },
              { source: 'freelance', target: 'spent', value: 2 },
              { source: 'freelance', target: 'saved', value: 2 },
              { source: 'spent', target: 'rent', value: 5 },
              { source: 'spent', target: 'food', value: 4 },
              { source: 'spent', target: 'transport', value: 2 },
              { source: 'saved', target: 'deposit', value: 5 },
            ]}
            formatValue={(v) => `${formatNumber(v)} mln soʻm`}
            label="Oylik daromad oqimi: 69 foizi xarajatga, 31 foizi jamgʻarmaga ketadi"
          />
        )}
      </ChartContainer>
    </Stack>
  );
}

/* ---------- radar-chart ---------- */

const RADAR_AXES = ['Tezlik', 'Sifat', 'Narx', 'Qoʻllab-quvvatlash', 'Xavfsizlik', 'Qulaylik'];

function RadarChartDemo() {
  return (
    <div className="flex flex-wrap gap-8 w-full max-w-3xl">
      <div className="w-full max-w-xs">
        <ChartContainer>
          {(width) => (
            <RadarChart
              variant="single"
              width={width}
              axes={RADAR_AXES}
              series={[{ name: 'BEK', values: [90, 72, 48, 80, 88, 76] }]}
              label="BEK profili: tezlik va xavfsizlik eng yuqori, narx eng past"
            />
          )}
        </ChartContainer>
      </div>
      <div className="w-full max-w-xs">
        <ChartContainer>
          {(width) => (
            <RadarChart
              variant="compare"
              width={width}
              axes={RADAR_AXES}
              series={[
                { name: 'BEK', values: [90, 72, 48, 80, 88, 76] },
                { name: 'Bozor oʻrtachasi', values: [60, 70, 66, 52, 62, 58] },
              ]}
              label="BEK tezlik va xavfsizlikda bozordan oldinda, narxda ortda"
            />
          )}
        </ChartContainer>
      </div>
    </div>
  );
}

/* ---------- scatter-chart ---------- */

const CLIENTS: ScatterPoint[] = Array.from({ length: 24 }, (_, i) => {
  const income = 4 + ((i * 37) % 41) / 2; // 4…24 mln
  const spend = Math.round((income * 0.62 + (((i * 13) % 9) - 4) * 0.6) * 10) / 10;
  return {
    x: income,
    y: spend,
    size: 20 + ((i * 17) % 60),
    group: i % 3 === 0 ? 'Biznes' : 'Shaxsiy',
    label: `Mijoz ${1040 + i}`,
  };
});

function ScatterChartDemo() {
  const fmt = (v: number) => formatNumber(v, { decimals: v % 1 ? 1 : 0 });
  return (
    <Stack>
      <ChartContainer>
        {(width) => (
          <ScatterChart
            variant="trend-line"
            width={width}
            seriesName="Mijozlar"
            xLabel="Daromad, mln soʻm"
            yLabel="Xarajat, mln soʻm"
            data={CLIENTS.map(({ x, y, label }) => ({ x, y, label }))}
            formatX={fmt}
            formatY={fmt}
            label="Xarajat daromad bilan kuchli bogʻliq: daromad oshgani sari xarajat ham oshadi"
          />
        )}
      </ChartContainer>
      <ChartContainer>
        {(width) => (
          <ScatterChart
            variant="bubble"
            width={width}
            xLabel="Daromad, mln soʻm"
            yLabel="Xarajat, mln soʻm"
            data={CLIENTS}
            formatX={fmt}
            formatY={fmt}
            label="Biznes va shaxsiy mijozlar: doira oʻlchami — tranzaksiyalar soni"
          />
        )}
      </ChartContainer>
    </Stack>
  );
}

/* ---------- beeswarm-chart ---------- */

const SEGMENTS = [
  { group: 'Chakana', base: 58, spread: 18 },
  { group: 'Kichik biznes', base: 44, spread: 30 },
  { group: 'Korporativ', base: 76, spread: 12 },
];

const SATISFACTION: BeeswarmDatum[] = SEGMENTS.flatMap(({ group, base, spread }, g) =>
  Array.from({ length: 24 }, (_, i) => {
    const offset = (((i * 29 + g * 7) % 21) / 20 - 0.5) * spread;
    return {
      group,
      value: Math.max(0, Math.min(100, Math.round(base + offset))),
      label: `Mijoz ${1000 + g * 100 + i}`,
    };
  }),
);

function BeeswarmChartDemo() {
  return (
    <Stack>
      <ChartContainer>
        {(width) => (
          <BeeswarmChart
            width={width}
            data={SATISFACTION}
            domain={[0, 100]}
            label="Mijoz qoniqishi, 0–100: korporativ mijozlar eng yuqori, kichik biznes eng keng tarqalgan"
          />
        )}
      </ChartContainer>
    </Stack>
  );
}

/* ---------- network-graph ---------- */

const NETWORK_NODES = [
  { id: 'bank', label: 'BEK Bank', group: 'Asosiy' },
  { id: 'cards', label: 'Kartalar', group: 'Toʻlovlar' },
  { id: 'transfers', label: 'Oʻtkazmalar', group: 'Toʻlovlar' },
  { id: 'qr', label: 'QR toʻlov', group: 'Toʻlovlar' },
  { id: 'loans', label: 'Kreditlar', group: 'Kreditlash' },
  { id: 'mortgage', label: 'Ipoteka', group: 'Kreditlash' },
  { id: 'auto', label: 'Avtokredit', group: 'Kreditlash' },
  { id: 'deposits', label: 'Omonatlar', group: 'Jamgʻarma' },
  { id: 'savings', label: 'Jamgʻarma hisobi', group: 'Jamgʻarma' },
];

const NETWORK_LINKS = [
  { source: 'bank', target: 'cards' },
  { source: 'bank', target: 'loans' },
  { source: 'bank', target: 'deposits' },
  { source: 'cards', target: 'transfers' },
  { source: 'cards', target: 'qr' },
  { source: 'loans', target: 'mortgage' },
  { source: 'loans', target: 'auto' },
  { source: 'deposits', target: 'savings' },
  { source: 'cards', target: 'savings' },
];

function NetworkGraphDemo() {
  return (
    <Stack>
      <ChartContainer>
        {(width) => (
          <NetworkGraph
            width={width}
            nodes={NETWORK_NODES}
            links={NETWORK_LINKS}
            label="BEK mahsulot ekotizimi: bank kartalar, kreditlar va omonatlarni bogʻlaydi"
          />
        )}
      </ChartContainer>
      <ChartContainer>
        {(width) => (
          <NetworkGraph
            variant="focus"
            focus="loans"
            width={width}
            nodes={NETWORK_NODES}
            links={NETWORK_LINKS}
            label="Kreditlar bankni ipoteka va avtokredit bilan bogʻlaydi"
          />
        )}
      </ChartContainer>
    </Stack>
  );
}

/* ---------- candlestick-chart ---------- */

const UZS_USD: Candle[] = [
  [12640, 12690, 12610, 12670, 9800],
  [12670, 12720, 12650, 12705, 11200],
  [12705, 12730, 12660, 12680, 10400],
  [12680, 12700, 12620, 12640, 12600],
  [12640, 12665, 12580, 12600, 13800],
  [12600, 12650, 12590, 12635, 9200],
  [12635, 12690, 12620, 12675, 10100],
  [12675, 12740, 12660, 12730, 14300],
  [12730, 12760, 12690, 12710, 11900],
  [12710, 12780, 12700, 12765, 12800],
].map(([o, h, l, c, v], i) => ({ t: `${12 + i} Okt`, o, h, l, c, v }));

function CandlestickChartDemo() {
  return (
    <Stack>
      <ChartContainer>
        {(width) => (
          <CandlestickChart
            variant="volume"
            width={width}
            data={UZS_USD}
            upLabel="Oʻsish"
            downLabel="Pasayish"
            formatValue={(v) => formatNumber(v)}
            formatVolume={(v) => formatNumber(v, { compact: true })}
            label="USD/UZS kursi 12–21 oktabr: 12 640 dan 12 765 soʻmgacha oʻsdi"
          />
        )}
      </ChartContainer>
    </Stack>
  );
}

/* ---------- cohort-heatmap ---------- */

const COHORTS = [
  { label: 'Yan 2026', size: 1240, values: [100, 62, 48, 41, 37, 34] },
  { label: 'Fev 2026', size: 1180, values: [100, 58, 45, 38, 35] },
  { label: 'Mar 2026', size: 1420, values: [100, 66, 52, 46] },
  { label: 'Apr 2026', size: 1510, values: [100, 68, 55] },
  { label: 'May 2026', size: 1630, values: [100, 71] },
  { label: 'Iyn 2026', size: 1710, values: [100] },
];

function CohortHeatmapDemo() {
  return (
    <Stack>
      <ChartContainer>
        {(width) => (
          <CohortHeatmap
            variant="percent"
            width={width}
            cohorts={COHORTS}
            cohortLabel="Kogorta"
            sizeLabel="Foydalanuvchi"
            label="Faol foydalanuvchilar saqlanishi: yangi kogortalar yaxshiroq, M1 62 foizdan 71 foizga oshdi"
          />
        )}
      </ChartContainer>
      <ChartContainer>
        {(width) => (
          <CohortHeatmap
            variant="absolute"
            width={width}
            cohorts={COHORTS.slice(0, 4)}
            cohortLabel="Kogorta"
            sizeLabel="Foydalanuvchi"
            label="Faol foydalanuvchilar soni kogorta boʻyicha: yanvar kogortasidan 6-oyda 422 kishi qoldi"
          />
        )}
      </ChartContainer>
    </Stack>
  );
}

/* ---------- gauge-chart ---------- */

function GaugeChartDemo() {
  return (
    <div className="flex flex-wrap gap-8">
      <GaugeChart
        value={620}
        min={300}
        max={850}
        caption="Kredit reytingi"
        label="Kredit reytingi 850 dan 620"
      />
      <GaugeChart
        variant="zones"
        value={620}
        min={300}
        max={850}
        zones={[
          { to: 520, label: 'Past' },
          { to: 685, label: 'Oʻrtacha' },
          { to: 850, label: 'Yaxshi' },
        ]}
        caption="Kredit reytingi"
        label="Kredit reytingi 620 — oʻrtacha zona"
      />
    </div>
  );
}

/* ---------- cluster-map ---------- */

const CLUSTERS = [
  { id: 'savers', label: 'Jamgʻaruvchilar' },
  { id: 'young', label: 'Yosh xaridorlar' },
  { id: 'business', label: 'Tadbirkorlar' },
];

const CLUSTER_CENTERS: Record<string, [number, number]> = {
  savers: [-0.5, 0.3],
  young: [0.55, 0.45],
  business: [0.05, -0.5],
};

const CLUSTER_POINTS: ClusterPoint[] = Array.from({ length: 15 }, (_, i) => {
  const cluster = CLUSTERS[i % 3].id;
  const [cx, cy] = CLUSTER_CENTERS[cluster];
  const angle = (i * 2.4) % (2 * Math.PI);
  const r = 0.08 + ((i * 7) % 5) * 0.04;
  return {
    x: Math.round((cx + r * Math.cos(angle)) * 100) / 100,
    y: Math.round((cy + r * Math.sin(angle)) * 100) / 100,
    cluster,
    label: `Mijoz ${1042 + i}`,
  };
});

function ClusterMapDemo() {
  return (
    <Stack>
      <ChartContainer>
        {(width) => (
          <ClusterMap
            width={width}
            points={CLUSTER_POINTS}
            clusters={CLUSTERS}
            caption="UMAP · 12 belgi"
            label="Uchta mijoz segmenti aniq ajralgan: jamgʻaruvchilar, yosh xaridorlar va tadbirkorlar"
          />
        )}
      </ChartContainer>
      <ChartContainer>
        {(width) => (
          <ClusterMap
            variant="labeled"
            width={width}
            points={CLUSTER_POINTS}
            clusters={CLUSTERS}
            caption="UMAP · 12 belgi · klaster nomlarini AI bergan"
            label="AI nomlagan uchta mijoz segmenti"
          />
        )}
      </ChartContainer>
    </Stack>
  );
}

/* ---------- model-comparison ---------- */

function ModelComparisonDemo() {
  return (
    <Stack>
      <ChartContainer>
        {(width) => (
          <ModelComparison
            width={width}
            models={['BEK-small', 'BEK-base', 'Vendor X']}
            metrics={[
              { label: 'Aniqlik', scores: [82, 91, 88], raw: ['82%', '91%', '88%'] },
              { label: 'Tezlik', scores: [95, 72, 60], raw: ['120 ms', '310 ms', '420 ms'] },
              {
                label: 'Narx samaradorligi',
                scores: [90, 70, 40],
                raw: ['4 soʻm', '9 soʻm', '18 soʻm'],
              },
              { label: 'Oʻzbek tili', scores: [78, 89, 64], raw: ['78%', '89%', '64%'] },
            ]}
            caption="Ball 0–100 · yuqori = yaxshi · tezlik va narx teskari qilingan"
            label="BEK-base aniqlik va oʻzbek tilida yetakchi; BEK-small eng tez va arzon"
          />
        )}
      </ChartContainer>
    </Stack>
  );
}

export const chartDemosC: Record<string, ComponentType> = {
  'calendar-heatmap': CalendarHeatmapDemo,
  'treemap-chart': TreemapChartDemo,
  'waffle-chart': WaffleChartDemo,
  'funnel-chart': FunnelChartDemo,
  'waterfall-chart': WaterfallChartDemo,
  'sankey-chart': SankeyChartDemo,
  'radar-chart': RadarChartDemo,
  'scatter-chart': ScatterChartDemo,
  'beeswarm-chart': BeeswarmChartDemo,
  'network-graph': NetworkGraphDemo,
  'candlestick-chart': CandlestickChartDemo,
  'cohort-heatmap': CohortHeatmapDemo,
  'gauge-chart': GaugeChartDemo,
  'cluster-map': ClusterMapDemo,
  'model-comparison': ModelComparisonDemo,
};
