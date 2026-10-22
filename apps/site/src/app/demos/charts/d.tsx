import { useState, type ComponentType, type ReactNode } from 'react';
import {
  AgentNode,
  BoxPlot,
  ChartContainer,
  ChordDiagram,
  CirclePacking,
  ConfusionMatrix,
  DiagramConnector,
  DiagramNode,
  HorizonChart,
  JourneyMap,
  MarimekkoChart,
  MindMap,
  OrgCard,
  RidgelineChart,
  Streamgraph,
  Swimlane,
  Timeline,
  TimelineItem,
  confusionStats,
  formatNumber,
  formatPercent,
  type BoxPlotDatum,
  type CirclePackingNode,
  type HorizonDatum,
  type JourneyStage,
  type MarimekkoDatum,
  type MindMapNode,
  type RidgelineDatum,
  type StreamDatum,
  type SwimlaneEdge,
  type SwimlaneStep,
} from '@bek-ui/charts';

// Chart demolari (d): diagram-node, diagram-connector, agent-node, org-card, timeline-item, marimekko-chart, circle-packing, chord-diagram, confusion-matrix, box-plot, ridgeline-chart, streamgraph, horizon-chart, mind-map, journey-map, swimlane.

/* ---------- Kichik layout yordamchilari ---------- */

const Stack = ({ children, wide = false }: { children: ReactNode; wide?: boolean }) => (
  <div className={`flex flex-col gap-6 w-full ${wide ? 'max-w-3xl' : 'max-w-xl'}`}>{children}</div>
);

const Caption = ({ children }: { children: ReactNode }) => (
  <p className="text-sm" style={{ color: 'var(--bek-text-secondary)', margin: 0 }}>
    {children}
  </p>
);

/* ---------- Deterministik namunalar ---------- */

const frac = (v: number) => v - Math.floor(v);

/** Taxminan normal taqsimlangan deterministik namuna: 3 ta kvazi-tasodifiy ketma-ketlik yig'indisi. */
function samples(center: number, sd: number, n: number, seed = 0): number[] {
  return Array.from({ length: n }, (_, k) => {
    const i = k + 1 + seed * 7;
    const z = (frac(i * 0.6180339) + frac(i * 0.4142135) + frac(i * 0.7320508) - 1.5) * 2;
    return Math.round((center + sd * z) * 10) / 10;
  });
}

/* ---------- diagram-node ---------- */

function DiagramNodeDemo() {
  return (
    <Stack>
      <div className="flex flex-wrap gap-4">
        <DiagramNode variant="terminal" label="Boshlash" />
        <DiagramNode label="Hujjatlarni tekshirish" highlighted />
        <DiagramNode variant="decision" label="Ma'qulmi?" />
        <DiagramNode variant="subprocess" label="KYC tekshiruvi" />
        <DiagramNode variant="data" label="Mijozlar bazasi" />
        <DiagramNode variant="note" label="Odatda 2 soatgacha" />
      </div>
      <Caption>
        Terminal · Process (joriy qadam) · Decision · Subprocess · Data · Note — kredit arizasi oqimi
        qadamlari.
      </Caption>
    </Stack>
  );
}

/* ---------- diagram-connector ---------- */

// Yuqoridan pastga oqim: tugunlar HTML qatlamida, strelkalar ostidagi aria-hidden <svg> da.
const FLOW_W = 384;
const FLOW_H = 440;

function DiagramConnectorDemo() {
  const at = (left: number, top: number) => ({ position: 'absolute' as const, left, top });
  return (
    <Stack>
      <div style={{ position: 'relative', width: FLOW_W, height: FLOW_H, maxWidth: '100%' }}>
        <svg
          width={FLOW_W}
          height={FLOW_H}
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0 }}
        >
          <DiagramConnector active from={{ x: 80, y: 56 }} to={{ x: 80, y: 120 }} />
          <DiagramConnector variant="labeled" label="Ha" from={{ x: 80, y: 200 }} to={{ x: 80, y: 264 }} />
          <DiagramConnector
            variant="labeled"
            route="elbow"
            label="Yo'q"
            from={{ x: 160, y: 160 }}
            to={{ x: 304, y: 264 }}
          />
          <DiagramConnector variant="dashed" from={{ x: 304, y: 320 }} to={{ x: 304, y: 384 }} />
        </svg>
        <DiagramNode style={at(0, 0)} variant="terminal" label="Ariza keldi" />
        <DiagramNode style={at(0, 120)} variant="decision" label="Ma'qulmi?" />
        <DiagramNode style={at(0, 264)} label="Karta chiqarish" />
        <DiagramNode style={at(224, 264)} label="Rad sababini yozish" />
        <DiagramNode style={at(224, 384)} label="SMS xabarnoma" />
      </div>
      <ol className="text-sm list-decimal pl-5" style={{ color: 'var(--bek-text-secondary)' }}>
        <li>Ariza keldi → Ma'qulmi? (joriy yo'l)</li>
        <li>Ma'qul bo'lsa → Karta chiqarish</li>
        <li>Ma'qul bo'lmasa → Rad sababini yozish</li>
        <li>Rad sababini yozish → SMS xabarnoma (ixtiyoriy, uzuq chiziq)</li>
      </ol>
    </Stack>
  );
}

/* ---------- agent-node ---------- */

function AgentNodeDemo() {
  return (
    <div className="flex flex-col gap-3 w-full max-w-sm">
      <AgentNode
        title="Murojaatni qabul qilish"
        type="Webhook"
        statusLabel="Tayyor"
        status="success"
        meta="0,2 s · 40 ta murojaat"
      />
      <AgentNode
        title="AI bilan tasniflash"
        type="LLM qadami"
        status="running"
        statusLabel="Bajarilmoqda"
        meta="40 tadan 12 tasi qayta ishlanmoqda"
      />
      <AgentNode
        title="CRM'ga yozish"
        type="HTTP so'rov"
        status="error"
        statusLabel="Xato"
        meta="So'rovlar limiti — 30 s dan keyin qayta urinish"
        href="#/components/agent-node"
      />
      <AgentNode
        title="Operatorga xabar"
        type="Telegram"
        statusLabel="Kutmoqda"
        meta="Kirish kutilmoqda"
      />
    </div>
  );
}

/* ---------- org-card ---------- */

function OrgCardDemo() {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <div role="tree" aria-label="Kompaniya tuzilmasi" className="flex flex-col gap-4 w-full max-w-sm">
      <OrgCard
        nodeRole="treeitem"
        name="Jasur Karimov"
        role="Bosh direktor"
        team="Boshqaruv"
        selected
      />
      <div role="group" className="flex flex-col gap-3 pl-6">
        <OrgCard nodeRole="treeitem" name="Dilnoza Nazarova" role="Moliya direktori" team="Moliya bo'limi" />
        <OrgCard
          nodeRole="treeitem"
          name="Sardor Aliyev"
          role="Savdo bo'limi boshlig'i"
          team="Savdo bo'limi"
          reports={12}
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
        />
        <OrgCard nodeRole="treeitem" name="Malika Yusupova" role="HR menejeri" team="Kadrlar bo'limi" />
      </div>
    </div>
  );
}

/* ---------- timeline-item ---------- */

function TimelineItemDemo() {
  return (
    <div className="w-full max-w-sm">
      <Timeline aria-label="Buyurtma holati">
        <TimelineItem
          title="Buyurtma qabul qilindi"
          stateLabel="Bajarildi"
          date="14-okt, 10:20"
          dateTime="2026-10-14T10:20"
        />
        <TimelineItem
          title="To'lov tasdiqlandi"
          stateLabel="Bajarildi"
          date="14-okt, 10:22"
          dateTime="2026-10-14T10:22"
        />
        <TimelineItem
          state="current"
          stateLabel="Joriy bosqich"
          title="Kuryerga topshirildi"
          date="Bugun"
          description="Yetkazish odatda 2 soatgacha davom etadi"
        />
        <TimelineItem state="upcoming" stateLabel="Kutilmoqda" title="Yetkazib berildi" />
      </Timeline>
    </div>
  );
}

/* ---------- marimekko-chart ---------- */

const MARIMEKKO: MarimekkoDatum[] = [
  { column: 'Toshkent', category: 'Kartalar', value: 42 },
  { column: 'Toshkent', category: 'Kreditlar', value: 28 },
  { column: 'Toshkent', category: 'Omonatlar', value: 18 },
  { column: 'Samarqand', category: 'Kartalar', value: 16 },
  { column: 'Samarqand', category: 'Kreditlar', value: 14 },
  { column: 'Samarqand', category: 'Omonatlar', value: 6 },
  { column: "Farg'ona", category: 'Kartalar', value: 12 },
  { column: "Farg'ona", category: 'Kreditlar', value: 11 },
  { column: "Farg'ona", category: 'Omonatlar', value: 5 },
  { column: 'Buxoro', category: 'Kartalar', value: 9 },
  { column: 'Buxoro', category: 'Kreditlar', value: 5 },
  { column: 'Buxoro', category: 'Omonatlar', value: 4 },
];

function MarimekkoChartDemo() {
  return (
    <Stack>
      <ChartContainer>
        {(width) => (
          <MarimekkoChart
            width={width}
            variant="labeled"
            data={MARIMEKKO}
            formatValue={(v) => `${formatNumber(v)} mlrd so'm`}
            label="Portfelning yarmi Toshkentda; har bir hududda kartalar yetakchi"
          />
        )}
      </ChartContainer>
      <ChartContainer>
        {(width) => (
          <MarimekkoChart
            width={width}
            data={MARIMEKKO}
            label="Hudud × mahsulot: Toshkent eng katta bozor, Buxoro eng kichik"
          />
        )}
      </ChartContainer>
    </Stack>
  );
}

/* ---------- circle-packing ---------- */

const PACK_NESTED: CirclePackingNode = {
  name: 'Ilovadan foydalanish',
  children: [
    {
      name: "To'lovlar",
      children: [
        { name: 'P2P', value: 42 },
        { name: 'QR', value: 30 },
        { name: 'Kommunal', value: 18 },
        { name: 'Mobil aloqa', value: 12 },
      ],
    },
    {
      name: "Jamg'arma",
      children: [
        { name: 'Omonat', value: 26 },
        { name: 'Maqsad', value: 10 },
      ],
    },
    {
      name: 'Kreditlar',
      children: [
        { name: 'Mikroqarz', value: 14 },
        { name: "Bo'lib to'lash", value: 9 },
      ],
    },
  ],
};

const PACK_FLAT: CirclePackingNode = {
  name: 'Oylik xarajatlar',
  children: [
    {
      name: 'Kundalik',
      children: [
        { name: 'Oziq-ovqat', value: 38 },
        { name: 'Transport', value: 14 },
        { name: 'Kafe', value: 11 },
      ],
    },
    {
      name: 'Uy',
      children: [
        { name: 'Ijara', value: 30 },
        { name: 'Kommunal', value: 9 },
      ],
    },
    {
      name: "Ko'ngilochar",
      children: [
        { name: 'Kino', value: 5 },
        { name: 'Obunalar', value: 4 },
        { name: 'Sayohat', value: 16 },
      ],
    },
  ],
};

function CirclePackingDemo() {
  return (
    <Stack>
      <ChartContainer>
        {(width) => (
          <CirclePacking
            width={width}
            height={280}
            variant="nested"
            data={PACK_NESTED}
            label="To'lovlar foydalanishda ustun; P2P eng katta alohida funksiya"
          />
        )}
      </ChartContainer>
      <ChartContainer>
        {(width) => (
          <CirclePacking
            width={width}
            height={280}
            variant="flat"
            data={PACK_FLAT}
            formatValue={(v) => `${v}%`}
            label="Oylik xarajatlar: oziq-ovqat va ijara eng katta toifalar"
          />
        )}
      </ChartContainer>
    </Stack>
  );
}

/* ---------- chord-diagram ---------- */

const CHORD_LABELS = ['Toshkent', 'Samarqand', 'Buxoro', 'Andijon', "Farg'ona"];
const CHORD_MATRIX = [
  [0, 120, 80, 60, 70],
  [90, 0, 30, 20, 15],
  [50, 25, 0, 10, 8],
  [40, 15, 12, 0, 35],
  [45, 12, 9, 30, 0],
];

function ChordDiagramDemo() {
  return (
    <Stack>
      <ChartContainer>
        {(width) => (
          <ChordDiagram
            width={width}
            height={280}
            labels={CHORD_LABELS}
            matrix={CHORD_MATRIX}
            formatValue={(v) => `${formatNumber(v)} mln so'm`}
            label="Hududlar orasidagi o'tkazmalar: ko'pi Toshkentdan boshlanadi"
          />
        )}
      </ChartContainer>
      <ChartContainer>
        {(width) => (
          <ChordDiagram
            width={width}
            height={280}
            labels={CHORD_LABELS}
            matrix={CHORD_MATRIX}
            variant="focus"
            focus="Toshkent"
            label="Toshkent bog'lanishlari: eng katta oqim Toshkent → Samarqand"
          />
        )}
      </ChartContainer>
    </Stack>
  );
}

/* ---------- confusion-matrix ---------- */

const CM_LABELS = ["To'lovlar", 'Kartalar', 'Kreditlar', 'Boshqa'];
const CM_MATRIX = [
  [412, 18, 9, 11],
  [22, 286, 6, 14],
  [7, 9, 198, 16],
  [21, 17, 12, 182],
];
const CM_STATS = confusionStats(CM_MATRIX);
const CM_SUMMARY = `Aniqlik ${formatPercent(CM_STATS.accuracy * 100, { decimals: 1 })} · ${formatNumber(
  CM_STATS.total,
)} ta namuna · ustunlar = bashorat`;

function ConfusionMatrixDemo() {
  return (
    <Stack>
      <ConfusionMatrix
        labels={CM_LABELS}
        matrix={CM_MATRIX}
        actualLabel="Haqiqiy ↓"
        summary={CM_SUMMARY}
        label="Murojaatlarni yo'naltirish modeli, sonlar: diagonal — to'g'ri javoblar"
      />
      <ConfusionMatrix
        labels={CM_LABELS}
        matrix={CM_MATRIX}
        variant="normalized"
        actualLabel="Haqiqiy ↓"
        summary={CM_SUMMARY}
        label="Murojaatlarni yo'naltirish modeli, qator ulushi: Boshqa ko'pincha To'lovlar bilan adashtiriladi"
      />
    </Stack>
  );
}

/* ---------- box-plot ---------- */

const BOX_DATA: BoxPlotDatum[] = [
  { group: 'Toshkent', values: [...samples(220, 45, 36, 1), 420, 455] },
  { group: 'Samarqand', values: [...samples(160, 35, 30, 2), 330] },
  { group: 'Buxoro', values: samples(130, 30, 24, 3) },
  { group: "Farg'ona", values: samples(150, 40, 28, 4) },
];

const BOX_POINTS: BoxPlotDatum[] = [
  {
    group: 'Kuryer A',
    values: [...samples(28, 6, 18, 5), 58],
    labels: Array.from({ length: 19 }, (_, i) => `#${1001 + i}`),
  },
  { group: 'Kuryer B', values: samples(34, 8, 16, 6) },
  { group: 'Kuryer C', values: samples(24, 4, 14, 7) },
];

function BoxPlotDemo() {
  const som = (v: number) => `${formatNumber(v)} ming`;
  return (
    <Stack>
      <ChartContainer>
        {(width) => (
          <BoxPlot
            width={width}
            sort
            data={BOX_DATA}
            formatValue={som}
            label="Shahar bo'yicha buyurtma summasi (ming so'm): Toshkentda mediana eng yuqori"
          />
        )}
      </ChartContainer>
      <ChartContainer>
        {(width) => (
          <BoxPlot
            width={width}
            variant="violin"
            data={BOX_DATA}
            formatValue={som}
            label="Buyurtma summasi taqsimoti shakli: Toshkentda tarqalish eng keng"
          />
        )}
      </ChartContainer>
      <ChartContainer>
        {(width) => (
          <BoxPlot
            width={width}
            variant="box-points"
            data={BOX_POINTS}
            formatValue={(v) => `${formatNumber(v)} daq`}
            label="Kuryerlar yetkazish vaqti (daqiqa): Kuryer C eng barqaror"
          />
        )}
      </ChartContainer>
    </Stack>
  );
}

/* ---------- ridgeline-chart ---------- */

const MONTHS = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun'];
const RIDGE_DATA: RidgelineDatum[] = MONTHS.map((group, i) => ({
  group,
  values: samples(35 - i * 3, 7 - i * 0.6, 60, i + 10),
}));

function RidgelineChartDemo() {
  const min = (v: number) => `${formatNumber(v)} daq`;
  return (
    <Stack>
      <ChartContainer>
        {(width) => (
          <RidgelineChart
            width={width}
            data={RIDGE_DATA}
            domain={[0, 60]}
            formatValue={min}
            label="Yetkazish vaqti iyungacha 35 daqiqadan 20 daqiqaga tushdi"
          />
        )}
      </ChartContainer>
      <ChartContainer>
        {(width) => (
          <RidgelineChart
            width={width}
            variant="highlight"
            highlight="Iyun"
            data={RIDGE_DATA}
            domain={[0, 60]}
            formatValue={min}
            label="Iyun: yetkazish vaqti eng qisqa va eng barqaror oy"
          />
        )}
      </ChartContainer>
    </Stack>
  );
}

/* ---------- streamgraph ---------- */

const CHANNELS = ['Mobil ilova', 'Veb-sayt', 'Telegram bot', 'Hamkorlar', 'Oflayn'];
const STREAM_BASE: Record<string, number[]> = {
  'Mobil ilova': [420, 470, 500, 520, 560, 600],
  'Veb-sayt': [260, 250, 245, 240, 230, 220],
  'Telegram bot': [40, 60, 90, 150, 240, 330],
  Hamkorlar: [120, 130, 125, 140, 150, 160],
  Oflayn: [180, 170, 160, 150, 140, 130],
};
const STREAM_DATA: StreamDatum[] = MONTHS.flatMap((date, i) =>
  CHANNELS.map((series) => ({ date, series, value: STREAM_BASE[series][i] })),
);

function StreamgraphDemo() {
  return (
    <Stack>
      <ChartContainer>
        {(width) => (
          <Streamgraph
            width={width}
            series={CHANNELS}
            data={STREAM_DATA}
            formatValue={(v) => `${formatNumber(v)} ming`}
            label="Kanal bo'yicha trafik: Telegram bot may oyidan eng tez o'smoqda"
          />
        )}
      </ChartContainer>
      <ChartContainer>
        {(width) => (
          <Streamgraph
            width={width}
            variant="expanded"
            series={CHANNELS}
            data={STREAM_DATA}
            label="Kanallar ulushi: mobil ilova barqaror, oflayn ulushi kamaymoqda"
          />
        )}
      </ChartContainer>
    </Stack>
  );
}

/* ---------- horizon-chart ---------- */

const HOURS = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
const LOAD: Record<string, (number | null)[]> = {
  Toshkent: [42, 30, 118, 96, 80, 72, 88, 60],
  Samarqand: [20, 14, 40, 66, 82, 70, 58, 34],
  "Farg'ona": [18, 12, 36, 54, 70, 112, 64, 30],
  Andijon: [16, 10, 28, 48, 60, 74, 90, 40],
  Buxoro: [12, 8, 22, 30, null, null, 46, 24],
};
const HORIZON_DATA: HorizonDatum[] = Object.entries(LOAD).flatMap(([series, values]) =>
  HOURS.map((date, i) => ({ series, date, value: values[i] })),
);
const PLAN_DELTA: Record<string, number[]> = {
  Toshkent: [4, -6, 18, 24, 10, -8, -14, 2],
  Samarqand: [-3, -8, -12, 6, 14, 20, 8, -2],
  "Farg'ona": [2, 0, -6, -18, -10, 12, 22, 6],
  Andijon: [-10, -14, -4, 8, 16, 4, -6, -12],
};
const HORIZON_DIVERGING: HorizonDatum[] = Object.entries(PLAN_DELTA).flatMap(([series, values]) =>
  HOURS.map((date, i) => ({ series, date, value: values[i] })),
);

function HorizonChartDemo() {
  return (
    <Stack>
      <ChartContainer>
        {(width) => (
          <HorizonChart
            width={width}
            bands={3}
            data={HORIZON_DATA}
            label="Hudud bo'yicha yuklama: Toshkent 06:00 da, Farg'ona 15:00 da cho'qqiga chiqadi"
          />
        )}
      </ChartContainer>
      <ChartContainer>
        {(width) => (
          <HorizonChart
            width={width}
            variant="diverging"
            bands={3}
            data={HORIZON_DIVERGING}
            bandLabels={['Rejadan yuqori', 'Rejadan past']}
            formatValue={(v) => `${v}%`}
            label="Rejaga nisbatan yuklama: Toshkent ertalab, Farg'ona kechqurun rejadan oshadi"
          />
        )}
      </ChartContainer>
    </Stack>
  );
}

/* ---------- mind-map ---------- */

const LAUNCH_MAP: MindMapNode = {
  label: 'Ilova relizi',
  children: [
    { label: 'Mahsulot' },
    { label: 'Marketing' },
    { label: "Qo'llab-quvvatlash" },
    { label: 'Huquqiy' },
    { label: 'Hamkorlar' },
    { label: 'Analitika' },
  ],
};

const Q4_GOALS: MindMapNode = {
  label: '4-chorak maqsadlari',
  children: [
    { label: 'Mahsulot', children: [{ label: 'Mobil ilova' }, { label: 'AI yordamchi' }] },
    { label: 'Savdo', children: [{ label: 'Yangi hududlar' }, { label: 'B2B tariflar' }] },
    { label: 'Jamoa', children: [{ label: 'Ishga qabul' }, { label: 'Mentorlik' }] },
  ],
};

function MindMapDemo() {
  return (
    <Stack wide>
      <MindMap root={LAUNCH_MAP} label="Ilova relizi: 6 yo'nalish" />
      <MindMap layout="tree" root={Q4_GOALS} label="4-chorak maqsadlari: 3 shox, 6 barg" />
    </Stack>
  );
}

/* ---------- journey-map ---------- */

const JOURNEY: JourneyStage[] = [
  {
    name: 'Qidiruv',
    action: "Telegram kanalda chegirma reklamasini ko'radi",
    touchpoints: ['Telegram', 'Sayt'],
    emotion: { score: 1, label: 'Qiziqqan' },
    opportunity: "Reklamada narxni ko'rsatish",
  },
  {
    name: 'Savat',
    action: "Mahsulotni savatga qo'shib, yetkazish narxini tekshiradi",
    touchpoints: ['Ilova'],
    emotion: { score: 0, label: 'Ikkilangan' },
    pain: "Yetkazish narxi oxirida chiqadi",
    opportunity: 'Narxni savatda darhol hisoblash',
  },
  {
    name: "To'lov",
    action: "Karta bilan to'laydi",
    touchpoints: ['Ilova', 'Payme'],
    emotion: { score: -2, label: 'Asabiy' },
    pain: 'SMS-kod ikki marta kelmaydi',
    opportunity: "Kartani saqlash, qayta urinish tugmasi",
  },
  {
    name: 'Yetkazish',
    action: 'Kuryerni xaritada kuzatadi va buyurtmani oladi',
    touchpoints: ['Ilova', 'Kuryer'],
    emotion: { score: 2, label: 'Mamnun' },
    opportunity: 'Baholash va bonus taklif qilish',
  },
];

function JourneyMapDemo() {
  return (
    <Stack wide>
      <JourneyMap
        stages={JOURNEY}
        label="Xaridor yo'li: 4 bosqich, eng og'ir nuqta — to'lov"
      />
      <div className="w-full max-w-sm">
        <JourneyMap
          layout="compact"
          stages={JOURNEY}
          label="Xaridor yo'li, ixcham: Qidiruv → Savat → To'lov → Yetkazish"
        />
      </div>
    </Stack>
  );
}

/* ---------- swimlane ---------- */

const ORDER_LANES = ['Mijoz', "Do'kon", 'Kuryer'];
const ORDER_STEPS: SwimlaneStep[] = [
  { id: 'order', lane: 'Mijoz', column: 0, shape: 'terminal', label: 'Buyurtma berish' },
  { id: 'stock', lane: "Do'kon", column: 1, shape: 'decision', label: 'Omborda bormi?' },
  { id: 'pack', lane: "Do'kon", column: 3, label: "Qadoqlash" },
  { id: 'refund', lane: 'Mijoz', column: 2, label: 'Pulni qaytarish' },
  { id: 'deliver', lane: 'Kuryer', column: 4, label: 'Yetkazish' },
  { id: 'done', lane: 'Mijoz', column: 5, shape: 'terminal', label: 'Qabul qilish' },
];
const ORDER_EDGES: SwimlaneEdge[] = [
  { from: 'order', to: 'stock' },
  { from: 'stock', to: 'pack', label: 'Ha' },
  { from: 'stock', to: 'refund', label: "Yo'q" },
  { from: 'pack', to: 'deliver' },
  { from: 'deliver', to: 'done' },
];

function SwimlaneDemo() {
  return (
    <Stack wide>
      <Swimlane
        lanes={ORDER_LANES}
        steps={ORDER_STEPS}
        edges={ORDER_EDGES}
        label="Buyurtma jarayoni: 3 ishtirokchi, 6 qadam, 1 qaror"
      />
      <Swimlane
        direction="vertical"
        lanes={ORDER_LANES}
        steps={ORDER_STEPS}
        edges={ORDER_EDGES}
        label="Buyurtma jarayoni, vertikal: Mijoz, Do'kon va Kuryer o'rtasida"
      />
    </Stack>
  );
}

export const chartDemosD: Record<string, ComponentType> = {
  'diagram-node': DiagramNodeDemo,
  'diagram-connector': DiagramConnectorDemo,
  'agent-node': AgentNodeDemo,
  'org-card': OrgCardDemo,
  'timeline-item': TimelineItemDemo,
  'marimekko-chart': MarimekkoChartDemo,
  'circle-packing': CirclePackingDemo,
  'chord-diagram': ChordDiagramDemo,
  'confusion-matrix': ConfusionMatrixDemo,
  'box-plot': BoxPlotDemo,
  'ridgeline-chart': RidgelineChartDemo,
  streamgraph: StreamgraphDemo,
  'horizon-chart': HorizonChartDemo,
  'mind-map': MindMapDemo,
  'journey-map': JourneyMapDemo,
  swimlane: SwimlaneDemo,
};
