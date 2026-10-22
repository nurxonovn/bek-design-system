import { useState, type ComponentType, type ReactNode } from 'react';
import {
  AnomalyChart,
  ChartAnnotation,
  ChartAxis,
  ChartBrush,
  ChartContainer,
  ChartCrosshair,
  ChartGridLine,
  ChartInsight,
  ChartPoint,
  ChartPredictionZone,
  ConfidenceMeter,
  FeatureImportance,
  ForecastChart,
  GeneratedChart,
  LineChart,
  LiveChart,
  UsageMeter,
  crosshairNearest,
  formatNumber,
  seriesColor,
  type ChartBrushRange,
  type LivePoint,
} from '@bek-ui/charts';

// Chart demolari (b): ai-insight, data-point, chart-axis, grid-line, annotation, crosshair, prediction-zone, range-brush, live-chart, forecast-chart, anomaly-chart, confidence-meter, usage-meter, generated-chart, feature-importance.

/* ---------- Kichik layout yordamchilari ---------- */

function Col({ children, className = 'max-w-xl' }: { children: ReactNode; className?: string }) {
  return <div className={`flex flex-col gap-4 w-full ${className}`}>{children}</div>;
}

function Caption({ children }: { children: ReactNode }) {
  return <p className="text-xs text-[var(--bek-text-secondary)]">{children}</p>;
}

/* ---------- Primitivlar uchun umumiy plot geometriyasi ---------- */
// SVG 480 × 200; plot x 40…470, y 8…180; qiymat oralig'i 0…100.
const SVG_W = 480;
const SVG_H = 200;
const PLOT_LEFT = 40;
const PLOT_RIGHT = 470;
const PLOT_TOP = 8;
const PLOT_BOTTOM = 180;
const Y_TICKS = [0, 25, 50, 75, 100];

const yOf = (v: number) => PLOT_BOTTOM - (v / 100) * (PLOT_BOTTOM - PLOT_TOP);
/** d3 o'rniga kichik chiziqli shkala — `ChartAxis` uchun `ticks()` bilan. */
const yScale = Object.assign((v: number) => yOf(v), { ticks: () => Y_TICKS });

const MONTHS = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn'];
const ORDERS = [42, 55, 48, 67, 72, 86];
const STEP_X = (PLOT_RIGHT - PLOT_LEFT) / (MONTHS.length - 1);
const POINTS = ORDERS.map((v, i) => ({ x: PLOT_LEFT + i * STEP_X, y: yOf(v), v }));
const POLYLINE = POINTS.map((p) => `${p.x},${p.y}`).join(' ');

function Grid() {
  return (
    <>
      {Y_TICKS.map((t) => (
        <ChartGridLine
          key={t}
          y={yOf(t)}
          x1={PLOT_LEFT}
          x2={PLOT_RIGHT}
          variant={t === 0 ? 'baseline' : 'solid'}
        />
      ))}
    </>
  );
}

function Line({ points = POLYLINE }: { points?: string }) {
  return (
    <polyline
      points={points}
      fill="none"
      stroke={seriesColor(0)}
      strokeWidth={2}
      strokeLinejoin="round"
      aria-hidden="true"
    />
  );
}

/* ---------- ai-insight ---------- */

function AiInsightDemo() {
  return (
    <Col>
      <figure className="bek-chart flex flex-col gap-2">
        <ChartContainer>
          {(width) => (
            <LineChart
              width={width}
              labels={['Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan', 'Yak']}
              series={[{ name: 'Daromad, mln soʻm', values: [48, 32, 41, 46, 52, 58, 61] }]}
              label="Daromad, oxirgi 7 kun: seshanba kuni 34% pasaygan, keyin tiklangan"
            />
          )}
        </ChartContainer>
        <ChartInsight
          text="Seshanba kuni narx oʻzgargach sotuvlar 34% kamaydi"
          srPrefix="AI xulosasi:"
        />
      </figure>
      <ChartInsight
        variant="callout"
        title="AI xulosasi"
        text="Yanvardan beri daromad 34% oʻsdi, eng katta hissa — Toshkent filiali"
      />
      <ChartInsight loading text="" srPrefix="AI xulosasi:" />
    </Col>
  );
}

/* ---------- data-point ---------- */

function DataPointDemo() {
  const last = POINTS[POINTS.length - 1];
  const odd = POINTS[3];
  return (
    <Col>
      <svg
        role="img"
        aria-label="Buyurtmalar, yanvar–iyun: iyunda eng yuqori 86 ming; aprelda kutilmagan sakrash"
        width={SVG_W}
        height={SVG_H}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full h-auto"
      >
        <Grid />
        <Line />
        {POINTS.slice(0, 3).map((p, i) => (
          <ChartPoint key={i} x={p.x} y={p.y} title={`${MONTHS[i]}: ${p.v} ming buyurtma`} />
        ))}
        <ChartPoint
          x={odd.x}
          y={odd.y}
          variant="anomaly"
          title="Apr: 67 ming — kutilgandan +40% (aksiya)"
        />
        <ChartPoint x={POINTS[4].x} y={POINTS[4].y} title="May: 72 ming buyurtma" />
        <ChartPoint
          x={last.x}
          y={last.y}
          variant="active"
          color={seriesColor(0)}
          title="Iyn: 86 ming buyurtma"
        />
      </svg>
      <div className="flex items-center gap-4">
        <ChartPoint standalone label="Oddiy nuqta" />
        <ChartPoint standalone variant="active" label="Faol nuqta" />
        <ChartPoint standalone variant="anomaly" label="Anomaliya nuqtasi" />
      </div>
    </Col>
  );
}

/* ---------- chart-axis ---------- */

function ChartAxisDemo() {
  return (
    <Col>
      <svg
        role="img"
        aria-label="Oylik buyurtmalar, ming: yanvardagi 42 dan iyundagi 86 gacha oʻsish"
        width={SVG_W}
        height={SVG_H + 16}
        viewBox={`0 0 ${SVG_W} ${SVG_H + 16}`}
        className="w-full h-auto"
      >
        <Grid />
        <Line />
        <ChartAxis scale={yScale} x={PLOT_LEFT} ticks={4} />
        <ChartAxis
          variant="x"
          y={PLOT_BOTTOM + 16}
          labels={MONTHS.map((m, i) => ({ x: PLOT_LEFT + i * STEP_X, label: m }))}
        />
      </svg>
      <Caption>Buyurtmalar, ming</Caption>
    </Col>
  );
}

/* ---------- grid-line ---------- */

function GridLineDemo() {
  return (
    <Col>
      <svg
        role="img"
        aria-label="Sotuvlar va reja: reja 85, iyunda 86 bilan bajarildi"
        width={SVG_W}
        height={SVG_H}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full h-auto"
      >
        <Grid />
        <ChartGridLine
          variant="target"
          y={yOf(85)}
          x1={PLOT_LEFT}
          x2={PLOT_RIGHT}
          valueLabel="Reja 85"
        />
        <Line />
      </svg>
      <ChartGridLine standalone variant="solid" label="Oddiy grid chizigʻi" />
      <ChartGridLine standalone variant="baseline" label="Nol chizigʻi" />
      <ChartGridLine standalone variant="target" valueLabel="Reja 85" />
    </Col>
  );
}

/* ---------- annotation ---------- */

function AnnotationDemo() {
  return (
    <Col>
      <svg
        role="img"
        aria-label="Daromad 2026. Izohlar: 1-apreldan narx oʻzgarishi, iyunda rekord, yanvar–fevral bayram mavsumi"
        width={SVG_W}
        height={SVG_H}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full h-auto"
      >
        <Grid />
        <ChartAnnotation
          variant="range"
          x={PLOT_LEFT}
          x2={POINTS[1].x}
          text="Bayram mavsumi"
          left={PLOT_LEFT}
          right={PLOT_RIGHT}
          bottom={PLOT_BOTTOM}
        />
        <Line />
        <ChartAnnotation
          x={POINTS[3].x}
          text="Narx oʻzgarishi"
          note="1-apreldan tarif +8%"
          left={PLOT_LEFT}
          right={PLOT_RIGHT}
          bottom={PLOT_BOTTOM}
        />
        <ChartAnnotation
          variant="point"
          x={POINTS[5].x}
          y={POINTS[5].y}
          text="Rekord"
          note="Iyun: 86 mln soʻm — yil rekordi"
          color={seriesColor(0)}
          left={PLOT_LEFT}
          right={PLOT_RIGHT}
          bottom={PLOT_BOTTOM}
        />
      </svg>
      <ChartAnnotation standalone x={120} text="Narx oʻzgarishi" note="1-apreldan tarif +8%" />
    </Col>
  );
}

/* ---------- crosshair ---------- */

function CrosshairDemo() {
  const pointerX = 300; // statik ko'rsatkich holati
  const i = crosshairNearest(
    POINTS.map((p) => p.x),
    pointerX,
  );
  const p = POINTS[i];
  return (
    <Col>
      <svg
        role="img"
        aria-label={`Buyurtmalar oylar boʻyicha; ${MONTHS[i]}: ${p.v} ming`}
        width={SVG_W}
        height={SVG_H}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full h-auto"
      >
        <Grid />
        <Line />
        {i >= 0 && (
          <ChartCrosshair
            x={p.x}
            y={p.y}
            xLabel={MONTHS[i]}
            color={seriesColor(0)}
            left={PLOT_LEFT}
            right={PLOT_RIGHT}
            bottom={PLOT_BOTTOM}
          />
        )}
      </svg>
      <ChartCrosshair
        variant="both"
        x={140}
        y={80}
        xLabel="12 Okt"
        yLabel={formatNumber(4820)}
        standalone
        right={240}
      />
    </Col>
  );
}

/* ---------- prediction-zone ---------- */

const PZ_OBSERVED = POINTS.slice(0, 4);
const PZ_LAST = PZ_OBSERVED[PZ_OBSERVED.length - 1];
const PZ_FORECAST = [PZ_LAST, { x: POINTS[4].x, y: yOf(74) }, { x: POINTS[5].x, y: yOf(80) }];

function PredictionZoneDemo() {
  return (
    <Col>
      <svg
        role="img"
        aria-label="Buyurtmalar prognozi apreldan: iyunda 80 ming, 80% oraliq 71–89"
        width={SVG_W}
        height={SVG_H}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full h-auto"
      >
        <ChartPredictionZone
          from={PZ_LAST.x}
          to={PLOT_RIGHT}
          top={PLOT_TOP}
          bottom={PLOT_BOTTOM}
          text="Prognoz"
          note="bek-forecast-v2 · 2 oy"
        />
        <Grid />
        <polygon
          points={`${PZ_LAST.x},${PZ_LAST.y} ${POINTS[4].x},${yOf(80)} ${POINTS[5].x},${yOf(89)} ${POINTS[5].x},${yOf(71)} ${POINTS[4].x},${yOf(68)}`}
          fill="var(--bek-dataviz-uncertainty-80)"
          aria-hidden="true"
        />
        <Line points={PZ_OBSERVED.map((q) => `${q.x},${q.y}`).join(' ')} />
        <polyline
          points={PZ_FORECAST.map((q) => `${q.x},${q.y}`).join(' ')}
          fill="none"
          stroke="var(--bek-dataviz-ai-accent)"
          strokeWidth={2}
          strokeDasharray="6 4"
          aria-hidden="true"
        />
      </svg>
      <ChartPredictionZone standalone from={0} to={160} text="Prognoz" note="bek-forecast-v2" />
    </Col>
  );
}

/* ---------- range-brush ---------- */

const UZ_MONTHS = ['Iyl', 'Avg', 'Sen', 'Okt'];
const MONTH_DAYS = [31, 31, 30, 31];
const BRUSH_DAYS = UZ_MONTHS.flatMap((m, mi) =>
  Array.from({ length: MONTH_DAYS[mi] }, (_, d) => `${d + 1} ${m}`),
);
const BRUSH_REVENUE = BRUSH_DAYS.map(
  (_, i) => Math.round((40 + 10 * Math.sin(i / 7) + i * 0.2 + ((i * 37) % 11)) * 10) / 10,
);

function RangeBrushDemo() {
  const [range, setRange] = useState<ChartBrushRange>({ startIndex: 31, endIndex: 61 });
  return (
    <Col>
      <ChartContainer>
        {(width) => (
          <LineChart
            width={width}
            labels={BRUSH_DAYS.slice(range.startIndex, range.endIndex + 1)}
            series={[
              {
                name: 'Daromad, mln soʻm',
                values: BRUSH_REVENUE.slice(range.startIndex, range.endIndex + 1),
              },
            ]}
            label={`Kunlik daromad, mln soʻm: ${BRUSH_DAYS[range.startIndex]} – ${BRUSH_DAYS[range.endIndex]}`}
          />
        )}
      </ChartContainer>
      <ChartContainer>
        {(width) => (
          <ChartBrush
            width={width}
            data={BRUSH_REVENUE}
            startIndex={range.startIndex}
            endIndex={range.endIndex}
            onChange={setRange}
            minSpan={7}
            formatIndex={(i) => BRUSH_DAYS[i]}
            label="Koʻrinadigan davr"
          />
        )}
      </ChartContainer>
      <Caption>
        Koʻrinadigan davr: {BRUSH_DAYS[range.startIndex]} – {BRUSH_DAYS[range.endIndex]}
      </Caption>
    </Col>
  );
}

/* ---------- live-chart ---------- */

// Qat'iy vaqt nuqtasi (deterministik): 2026-10-22 09:00:00 UTC, har 5 s da bitta nuqta, 5 daqiqa.
const LIVE_START = Date.UTC(2026, 9, 22, 9, 0, 0);
const LIVE_STEP = 5_000;
const LIVE_STREAM: LivePoint[] = Array.from({ length: 61 }, (_, i) => ({
  t: LIVE_START + i * LIVE_STEP,
  v: Math.round(52 + 14 * Math.sin(i / 5) + 6 * Math.cos(i / 2) + ((i * 13) % 7)),
}));
const pad2 = (n: number) => String(n).padStart(2, '0');
/** Vaqt zonasiga bog'liq bo'lmagan yozuv (UTC+5, Toshkent). */
const formatTashkent = (t: number) => {
  const d = new Date(t + 5 * 3_600_000);
  return `${pad2(d.getUTCHours())}:${pad2(d.getUTCMinutes())}:${pad2(d.getUTCSeconds())}`;
};

function LiveChartDemo() {
  return (
    <Col>
      <ChartContainer>
        {(width) => (
          <LiveChart
            width={width}
            stream={LIVE_STREAM}
            window={5 * 60_000}
            domain={[0, 100]}
            formatTime={formatTashkent}
            updated="Har 5 soniyada yangilanadi"
            label="Soniyasiga tranzaksiyalar, oxirgi 5 daqiqa: 40 dan 80 gacha"
          />
        )}
      </ChartContainer>
      <ChartContainer>
        {(width) => (
          <LiveChart
            width={width}
            stream={LIVE_STREAM}
            window={5 * 60_000}
            domain={[0, 100]}
            formatTime={formatTashkent}
            status="stale"
            statusLabel="KECHIKMOQDA"
            updated="Oxirgi maʼlumot 20 soniya oldin"
            label="Soniyasiga tranzaksiyalar, oqim kechikmoqda"
          />
        )}
      </ChartContainer>
    </Col>
  );
}

/* ---------- forecast-chart ---------- */

const FC_LABELS = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn', 'Iyl', 'Avg', 'Sen', 'Okt', 'Noy'];
const FC_ACTUAL = [42, 48, 45, 55, 58, 54, 67];
const FC_FORECAST = [
  { value: 71, range: { 80: [66, 76] as [number, number], 95: [63, 80] as [number, number] } },
  { value: 74, range: { 80: [66, 82] as [number, number], 95: [62, 88] as [number, number] } },
  { value: 78, range: { 80: [67, 88] as [number, number], 95: [63, 95] as [number, number] } },
  { value: 82, range: { 80: [71, 93] as [number, number], 95: [64, 100] as [number, number] } },
];

function ForecastChartDemo() {
  return (
    <Col>
      <ChartContainer>
        {(width) => (
          <ForecastChart
            width={width}
            labels={FC_LABELS}
            actual={FC_ACTUAL}
            forecast={FC_FORECAST}
            actualLabel="Haqiqiy"
            forecastLabel="Prognoz"
            todayLabel="Bugun"
            zoneLabel="Prognoz"
            label="Noyabr uchun daromad prognozi 82 mln soʻm, ehtimol 71–93 oraligʻida (80%), keyingi 4 oy"
          />
        )}
      </ChartContainer>
      <ChartContainer>
        {(width) => (
          <ForecastChart
            width={width}
            labels={FC_LABELS}
            actual={FC_ACTUAL}
            forecast={FC_FORECAST}
            target={85}
            actualLabel="Haqiqiy"
            forecastLabel="Prognoz"
            todayLabel="Bugun"
            zoneLabel="Prognoz"
            label="Noyabr prognozi 82 mln soʻm — reja 85 dan past, 80% oraliq 71–93"
          />
        )}
      </ChartContainer>
    </Col>
  );
}

/* ---------- anomaly-chart ---------- */

const AN_LABELS = Array.from({ length: 11 }, (_, i) => `${i + 1} Iyl`);
const AN_VALUES = [48, 50, 47, 52, 51, 49, 78, 52, 50, 24, 55];
const AN_ANOMALIES = [
  { index: 6, reason: 'Ish haqi kuni + aksiya' },
  { index: 9, reason: 'Toʻlov shlyuzidagi uzilish' },
];

function AnomalyChartDemo() {
  return (
    <Col>
      <ChartContainer>
        {(width) => (
          <AnomalyChart
            width={width}
            labels={AN_LABELS}
            values={AN_VALUES}
            anomalies={AN_ANOMALIES}
            seriesLabel="Daromad, mln soʻm"
            anomalyLabel="Anomaliya"
            insight="2 ta anomaliya: 7-iyulda sakrash (+52%), 10-iyulda pasayish (−52%)"
            label="Iyulda ikki anomaliya: 7-kuni sakrash va 10-kuni pasayish"
          />
        )}
      </ChartContainer>
      <ChartContainer>
        {(width) => (
          <AnomalyChart
            width={width}
            labels={AN_LABELS}
            values={AN_VALUES}
            anomalies={AN_ANOMALIES}
            expected={{
              lower: [40, 41, 41, 42, 42, 43, 43, 44, 44, 45, 45],
              upper: [56, 56, 57, 57, 58, 58, 59, 59, 60, 61, 61],
            }}
            seriesLabel="Daromad, mln soʻm"
            anomalyLabel="Anomaliya"
            expectedLabel="Kutilgan oraliq"
            insight="2 ta anomaliya kutilgan oraliqdan tashqarida: 7 va 10-iyul"
            label="Daromad kutilgan oraliq bilan: 7 va 10-iyul oraliqdan tashqarida"
          />
        )}
      </ChartContainer>
    </Col>
  );
}

/* ---------- confidence-meter ---------- */

const CONFIDENCE_LEVELS = { high: 'Yuqori', medium: 'Oʻrta', low: 'Past' };

function ConfidenceMeterDemo() {
  return (
    <Col className="max-w-sm">
      <ConfidenceMeter
        value={0.92}
        label="Ishonch"
        levelLabels={CONFIDENCE_LEVELS}
        reason="3 manbadan 2,4 mln qator asosida"
      />
      <ConfidenceMeter
        value={0.64}
        label="Ishonch"
        levelLabels={CONFIDENCE_LEVELS}
        reason="Oxirgi 2 oy maʼlumoti toʻliq emas"
      />
      <ConfidenceMeter
        value={0.31}
        label="Ishonch"
        levelLabels={CONFIDENCE_LEVELS}
        reason="Maʼlumot yetarli emas — ulashishdan oldin tekshiring"
      />
    </Col>
  );
}

/* ---------- usage-meter ---------- */

function UsageMeterDemo() {
  return (
    <Col className="max-w-sm">
      <UsageMeter
        label="AI tokenlar"
        used={450000}
        limit={1000000}
        forecast={650000}
        resetAt="1-noyabrda yangilanadi"
      />
      <UsageMeter
        label="AI tokenlar"
        used={820000}
        limit={1000000}
        forecast={960000}
        resetAt="1-noyabrda yangilanadi"
      />
      <UsageMeter
        label="AI tokenlar"
        used={1000000}
        limit={1000000}
        resetAt="1-noyabrda yangilanadi"
        note="Limitga yetildi — 3 kundan keyin yangilanadi"
      />
    </Col>
  );
}

/* ---------- generated-chart ---------- */

const GEN_MONTHS = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn'];
const noop = () => {};

function GeneratedChartDemo() {
  return (
    <Col>
      <GeneratedChart
        title="Oylar boʻyicha daromad, 2026"
        generatedBy="BEK AI yaratdi"
        timestamp="Hozirgina"
        source={`Manba: payments.csv · ${formatNumber(1240)} qator`}
        insight="Yanvardan beri daromad 34% oʻsdi; mayda narx oʻzgarishidan keyin pasaydi"
        onShowTable={noop}
        onShowCode={noop}
        onSave={noop}
      >
        <ChartContainer>
          {(width) => (
            <LineChart
              width={width}
              area
              labels={GEN_MONTHS}
              series={[{ name: 'Daromad, mln soʻm', values: [3.6, 4.1, 4.4, 4.9, 4.3, 4.8] }]}
              label="Daromad yanvardan iyungacha 34% oʻsdi"
            />
          )}
        </ChartContainer>
      </GeneratedChart>
      <GeneratedChart
        state="generating"
        title="Oylar boʻyicha daromad, 2026"
        generatedBy="BEK AI yaratdi"
        generatingLabel="Chart yaratilmoqda…"
        step="2-qadam, jami 3"
        progressNote={`payments.csv dan ${formatNumber(1240)} qator oʻqilmoqda va chart turi tanlanmoqda`}
      />
      <GeneratedChart
        state="error"
        title="Oylar boʻyicha daromad, 2026"
        generatedBy="BEK AI yaratdi"
        errorTitle="Chartni yaratib boʻlmadi"
        errorDescription="payments.csv faylini oʻqishda xatolik. Qayta urinib koʻring."
        onRetry={noop}
      />
    </Col>
  );
}

/* ---------- feature-importance ---------- */

const CONTRIBUTIONS = [
  { feature: 'Daromad', value: 0.42 },
  { feature: 'Toʻlov tarixi', value: 0.31 },
  { feature: 'Qarz ulushi', value: -0.27 },
  { feature: 'Hisob yoshi', value: 0.12 },
  { feature: 'Soʻnggi soʻrovlar', value: -0.08 },
];

function FeatureImportanceDemo() {
  return (
    <Col>
      <ChartContainer>
        {(width) => (
          <FeatureImportance
            width={width}
            contributions={CONTRIBUTIONS}
            raisesLabel="Oshiradi"
            lowersLabel="Pasaytiradi"
            otherLabel="Boshqa omillar"
            label="Daromad ballni eng koʻp oshirdi (+0,42); qarz ulushi pasaytirdi (−0,27)"
          />
        )}
      </ChartContainer>
      <ChartContainer>
        {(width) => (
          <FeatureImportance
            width={width}
            variant="waterfall"
            base={0.35}
            contributions={CONTRIBUTIONS}
            baseLabel="Bazaviy daraja"
            predictionLabel="Bashorat"
            pathLabel="Baza → bashorat"
            otherLabel="Boshqa omillar"
            label="0,35 bazaviy darajadan 0,85 bashoratgacha"
          />
        )}
      </ChartContainer>
    </Col>
  );
}

export const chartDemosB: Record<string, ComponentType> = {
  'ai-insight': AiInsightDemo,
  'data-point': DataPointDemo,
  'chart-axis': ChartAxisDemo,
  'grid-line': GridLineDemo,
  annotation: AnnotationDemo,
  crosshair: CrosshairDemo,
  'prediction-zone': PredictionZoneDemo,
  'range-brush': RangeBrushDemo,
  'live-chart': LiveChartDemo,
  'forecast-chart': ForecastChartDemo,
  'anomaly-chart': AnomalyChartDemo,
  'confidence-meter': ConfidenceMeterDemo,
  'usage-meter': UsageMeterDemo,
  'generated-chart': GeneratedChartDemo,
  'feature-importance': FeatureImportanceDemo,
};
