import React, { useState, type ComponentType } from 'react';
import {
  BarChart,
  BulletChart,
  BumpChart,
  ChartCard,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  Delta,
  DonutChart,
  DumbbellChart,
  KpiCard,
  LegendItem,
  LineChart,
  LollipopChart,
  RadialBarChart,
  SlopeChart,
  Sparkline,
  formatNumber,
  seriesColor,
} from '@bek-ui/charts';

// Chart demolari (a): legend-item, chart-tooltip, delta, sparkline, bar-chart, line-chart, donut-chart, chart-card, kpi-card, lollipop-chart, dumbbell-chart, bullet-chart, radial-bar-chart, bump-chart, slope-chart.

const Stack = ({
  children,
  className = 'max-w-xl',
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`flex flex-col gap-6 w-full ${className}`}>{children}</div>;
const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-wrap items-start gap-4">{children}</div>
);

const MONTHS = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun'];

const ORDERS_DATA = [
  { label: 'Yan', values: [420] },
  { label: 'Fev', values: [510] },
  { label: 'Mar', values: [480] },
  { label: 'Apr', values: [620] },
  { label: 'May', values: [590] },
  { label: 'Iyun', values: [740] },
];
const ORDERS_YOY = [
  { label: 'Yan', values: [420, 350] },
  { label: 'Fev', values: [510, 400] },
  { label: 'Mar', values: [480, 430] },
  { label: 'Apr', values: [620, 470] },
];
const CHANNELS = [
  { label: 'Yan', values: [210, 140, 70] },
  { label: 'Fev', values: [250, 170, 90] },
  { label: 'Mar', values: [230, 160, 90] },
  { label: 'Apr', values: [300, 210, 110] },
];
const REGIONS = [
  { label: 'Toshkent shahri', values: [1840] },
  { label: 'Samarqand viloyati', values: [920] },
  { label: 'Farg‘ona viloyati', values: [780] },
  { label: 'Buxoro viloyati', values: [610] },
  { label: 'Xorazm viloyati', values: [430] },
];

const REVENUE_SERIES = [
  { name: 'Daromad', values: [42, 55, 48, 66, 61, 82] },
  { name: 'Reja', values: [50, 55, 60, 65, 70, 75], dashed: true },
];
const USERS_SERIES = [{ name: 'Faol foydalanuvchilar', values: [8.2, 9.1, 9.6, 10.4, 11.3, 12.5] }];
const PLATFORM_SERIES = [
  { name: 'iOS', values: [3.1, 3.4, 3.6, 4.0, 4.3, 4.8] },
  { name: 'Android', values: [4.2, 4.6, 4.9, 5.3, 5.8, 6.4] },
  { name: 'Veb', values: [0.9, 1.1, 1.1, 1.1, 1.2, 1.3] },
];

const PAYMENT_SHARES = [
  { label: 'Kartalar', value: 4820 },
  { label: 'Kreditlar', value: 2210 },
  { label: 'Omonatlar', value: 1540 },
  { label: 'Boshqa', value: 620, color: 'var(--bek-dataviz-neutral)' },
];

const SKILLS = [
  { label: 'Dizayn', value: 88 },
  { label: 'Frontend', value: 74 },
  { label: 'Backend', value: 69 },
  { label: 'Analitika', value: 63 },
  { label: 'QA', value: 52 },
  { label: 'DevOps', value: 47 },
];

const PLAN_VS_ACTUAL = [
  { label: '1-chorak', from: 40, to: 56 },
  { label: '2-chorak', from: 47, to: 44 },
  { label: '3-chorak', from: 52, to: 61 },
  { label: '4-chorak', from: 60, to: 58 },
];

const KPI_TARGETS = [
  { name: 'Daromad', value: 72, target: 80, ranges: [50, 75, 100] },
  { name: 'NPS', value: 84, target: 75, ranges: [40, 60, 100] },
  { name: 'SLA', value: 91, target: 95, ranges: [70, 90, 100] },
];

const PLAN_COMPLETION = [
  { label: 'Kartalar', value: 0.82 },
  { label: 'Oʻtkazmalar', value: 0.64 },
  { label: 'Kreditlar', value: 0.47 },
];
const WEEKLY_GOALS = [
  { label: 'Harakat', value: 0.76 },
  { label: 'Oʻqish', value: 0.58 },
];

const BRANCH_RANKS = [
  { label: 'Toshkent', ranks: [1, 1, 2, 1] },
  { label: 'Samarqand', ranks: [2, 3, 1, 2] },
  { label: 'Buxoro', ranks: [3, 2, 3, 3] },
  { label: 'Namangan', ranks: [4, 4, 4, 4] },
];

const PRODUCT_SHIFT = [
  { label: 'Kartalar', from: 42, to: 61 },
  { label: 'Oʻtkazmalar', from: 55, to: 48 },
  { label: 'Kreditlar', from: 30, to: 44 },
  { label: 'Omonatlar', from: 36, to: 36 },
];

const PERIODS = [
  { value: '1m', label: '1O' },
  { value: '6m', label: '6O' },
  { value: '1y', label: '1Y' },
];

function LegendItemDemo() {
  const [hidden, setHidden] = useState<boolean[]>([false, false, false]);
  const toggle = (i: number) => setHidden((prev) => prev.map((h, j) => (j === i ? !h : h)));
  return (
    <Stack>
      <Row>
        <LegendItem variant="dot">Daromad</LegendItem>
        <LegendItem variant="square" color={seriesColor(1)}>
          Xarajat
        </LegendItem>
        <LegendItem variant="line" color={seriesColor(2)}>
          Foyda
        </LegendItem>
        <LegendItem variant="dashed">Reja</LegendItem>
      </Row>
      <ChartLegend
        aria-label="Seriyalarni yoqish va oʻchirish"
        items={[
          { label: 'Daromad', variant: 'line', hidden: hidden[0] },
          { label: 'Xarajat', variant: 'line', color: seriesColor(1), hidden: hidden[1] },
          { label: 'Reja', variant: 'dashed', hidden: hidden[2] },
        ]}
        onToggle={toggle}
      />
    </Stack>
  );
}

function ChartTooltipDemo() {
  return (
    <Row>
      <ChartTooltip
        title="18 okt 2026"
        rows={[{ label: 'Buyurtmalar', value: formatNumber(1940) }]}
      />
      <ChartTooltip
        title="18 okt 2026"
        rows={[
          { label: 'Daromad, soʻm', value: formatNumber(12450000) },
          { label: 'Xarajat, soʻm', value: formatNumber(8120000), color: seriesColor(1) },
          { label: 'Reja, soʻm', value: formatNumber(12000000), dashed: true },
        ]}
      />
    </Row>
  );
}

function DeltaDemo() {
  return (
    <Row>
      <Delta value={12.4} />
      <Delta value={-3.1} />
      <Delta value={8.2} betterWhen="down" />
      <Delta value={0.2} />
      <Delta value={4.5} label="+1 240 soʻm" />
    </Row>
  );
}

function SparklineDemo() {
  return (
    <Row>
      <Sparkline data={[12, 14, 13, 17, 19, 22]} label="Daromad 6 kunda oʻsdi: 12 dan 22 gacha" />
      <Sparkline data={[22, 20, 21, 17, 15, 13]} label="Qaytarishlar 6 kunda kamaydi: 22 dan 13 gacha" />
      <Sparkline data={[15, 16, 14, 15, 16, 15]} label="Konversiya 6 kun davomida barqaror, 15%" />
      <Sparkline
        variant="bars"
        data={[32, 38, 35, 41, 39, 45, 43, 52]}
        label="Buyurtmalar, oxirgi 8 hafta: 32 dan 52 gacha"
      />
    </Row>
  );
}

function BarChartDemo() {
  return (
    <Stack>
      <ChartContainer>
        {(width) => (
          <BarChart
            width={width}
            data={ORDERS_DATA}
            series={[{ name: 'Buyurtmalar' }]}
            label="Buyurtmalar yanvardan iyungacha 420 dan 740 gacha oʻsdi"
          />
        )}
      </ChartContainer>
      <ChartContainer>
        {(width) => (
          <BarChart
            width={width}
            variant="grouped"
            series={[{ name: '2026' }, { name: '2025' }]}
            data={ORDERS_YOY}
            label="Buyurtmalar 2026 va 2025: har oy oʻtgan yildan yuqori"
          />
        )}
      </ChartContainer>
      <ChartContainer>
        {(width) => (
          <BarChart
            width={width}
            variant="stacked"
            series={[{ name: 'Ilova' }, { name: 'Veb-sayt' }, { name: 'Filial' }]}
            data={CHANNELS}
            label="Buyurtmalar kanallar boʻyicha: ilova ulushi eng katta"
          />
        )}
      </ChartContainer>
      <ChartContainer>
        {(width) => (
          <BarChart
            width={width}
            variant="horizontal"
            series={[{ name: 'Mijozlar' }]}
            data={REGIONS}
            label="Mijozlar soni hududlar boʻyicha: Toshkent shahri 1 840 bilan yetakchi"
          />
        )}
      </ChartContainer>
    </Stack>
  );
}

function LineChartDemo() {
  return (
    <Stack>
      <ChartContainer>
        {(width) => (
          <LineChart
            width={width}
            labels={MONTHS}
            series={REVENUE_SERIES}
            label="Daromad olti oyda 95% oʻsdi va iyunda rejadan oshdi"
          />
        )}
      </ChartContainer>
      <ChartContainer>
        {(width) => (
          <LineChart
            width={width}
            area
            labels={MONTHS}
            series={USERS_SERIES}
            formatValue={(v) => `${formatNumber(v, { decimals: 1 })} ming`}
            label="Faol foydalanuvchilar 8,2 mingdan 12,5 minggacha oʻsdi"
          />
        )}
      </ChartContainer>
      <ChartContainer>
        {(width) => (
          <LineChart
            width={width}
            labels={MONTHS}
            series={PLATFORM_SERIES}
            label="Platformalar boʻyicha foydalanuvchilar: Android yetakchi, veb deyarli oʻzgarmadi"
          />
        )}
      </ChartContainer>
    </Stack>
  );
}

function DonutChartDemo() {
  return (
    <Row>
      <DonutChart
        data={PAYMENT_SHARES}
        centerLabel="Jami, mln soʻm"
        label="Daromadning yarmidan koʻpi kartalardan"
      />
      <DonutChart
        variant="progress"
        progress={0.72}
        centerLabel="maqsaddan"
        label="Choraklik maqsadning 72% bajarildi"
      />
    </Row>
  );
}

function ChartCardDemo() {
  const [period, setPeriod] = useState('6m');
  return (
    <Stack>
      <ChartCard
        title="Daromad"
        subtitle="Oxirgi 6 oy · mln soʻm"
        periods={PERIODS}
        period={period}
        onPeriodChange={setPeriod}
        kpi={{ value: '4 820 mln', delta: 12.4, comparison: 'oldingi 6 oyga nisbatan' }}
        footer="Manba: Core banking · Yangilandi 18 okt, 09:40"
      >
        <ChartContainer>
          {(w) => (
            <LineChart
              width={w}
              labels={MONTHS}
              series={REVENUE_SERIES}
              label="Daromad olti oyda 95% oʻsdi va iyunda rejadan oshdi"
            />
          )}
        </ChartContainer>
      </ChartCard>
      <ChartCard
        title="Buyurtmalar"
        subtitle="Oxirgi 6 oy"
        state="error"
        errorTitle="Maʼlumotni yuklab boʻlmadi"
        errorDescription="Server javob bermadi. Birozdan soʻng qayta urinib koʻring."
        errorSource="Manba: Buyurtmalar API"
        onRetry={() => undefined}
      />
    </Stack>
  );
}

function KpiCardDemo() {
  return (
    <Row>
      <KpiCard
        label="Faol foydalanuvchilar"
        value={formatNumber(12480)}
        delta={12.4}
        comparison="oʻtgan haftaga nisbatan"
        trend={[9, 10, 9.6, 11, 12.1, 12.48]}
      />
      <KpiCard variant="compact" label="Oʻtkazmalar" value={formatNumber(1940)} delta={-3.1} />
      <KpiCard
        variant="progress"
        label="Oylik maqsad"
        goal={{ progress: 0.72, label: '3,6 / 5 mln soʻm' }}
        comparison="8 kun qoldi"
      />
    </Row>
  );
}

function LollipopChartDemo() {
  return (
    <Stack>
      <ChartContainer>
        {(width) => (
          <LollipopChart
            width={width}
            data={SKILLS}
            label="Koʻnikmalar reytingi: Dizayn 88 ball bilan yetakchi"
          />
        )}
      </ChartContainer>
    </Stack>
  );
}

function DumbbellChartDemo() {
  return (
    <Stack>
      <ChartContainer>
        {(width) => (
          <DumbbellChart
            width={width}
            fromLabel="Reja"
            toLabel="Fakt"
            data={PLAN_VS_ACTUAL}
            label="Fakt 1 va 3-choraklarda rejadan oshdi, 2 va 4-choraklarda biroz ortda qoldi"
          />
        )}
      </ChartContainer>
    </Stack>
  );
}

function BulletChartDemo() {
  return (
    <Stack>
      <ChartContainer>
        {(width) => (
          <BulletChart
            width={width}
            name="Daromad"
            value={72}
            target={80}
            ranges={[50, 75, 100]}
            label="Daromad 72, maqsad 80"
          />
        )}
      </ChartContainer>
      <ChartContainer>
        {(width) => (
          <BulletChart
            width={width}
            data={KPI_TARGETS}
            max={100}
            label="KPI va maqsadlar: faqat NPS maqsadga yetdi"
          />
        )}
      </ChartContainer>
    </Stack>
  );
}

function RadialBarChartDemo() {
  return (
    <Stack>
      <RadialBarChart
        data={PLAN_COMPLETION}
        label="Reja bajarilishi: Kartalar 82%, Oʻtkazmalar 64%, Kreditlar 47%"
      />
      <RadialBarChart
        variant="progress"
        centerLabel="haftalik maqsad"
        data={WEEKLY_GOALS}
        label="Haftalik maqsad 67% bajarildi"
      />
    </Stack>
  );
}

function BumpChartDemo() {
  return (
    <Stack>
      <ChartContainer>
        {(width) => (
          <BumpChart
            width={width}
            periods={['1-ch', '2-ch', '3-ch', '4-ch']}
            series={BRANCH_RANKS}
            highlight="Toshkent"
            label="Toshkent: 3-chorakdan tashqari hamma davrda #1"
          />
        )}
      </ChartContainer>
    </Stack>
  );
}

function SlopeChartDemo() {
  return (
    <Row>
      <SlopeChart
        periods={['2025', '2026']}
        data={PRODUCT_SHIFT}
        label="Kartalar va kreditlar oʻsdi, oʻtkazmalar kamaydi, omonatlar oʻzgarmadi"
      />
      <SlopeChart
        periods={['2025', '2026']}
        data={PRODUCT_SHIFT}
        highlight="Kreditlar"
        label="Kreditlar 30 → 44, oʻsish"
      />
    </Row>
  );
}

export const chartDemosA: Record<string, ComponentType> = {
  'legend-item': LegendItemDemo,
  'chart-tooltip': ChartTooltipDemo,
  delta: DeltaDemo,
  sparkline: SparklineDemo,
  'bar-chart': BarChartDemo,
  'line-chart': LineChartDemo,
  'donut-chart': DonutChartDemo,
  'chart-card': ChartCardDemo,
  'kpi-card': KpiCardDemo,
  'lollipop-chart': LollipopChartDemo,
  'dumbbell-chart': DumbbellChartDemo,
  'bullet-chart': BulletChartDemo,
  'radial-bar-chart': RadialBarChartDemo,
  'bump-chart': BumpChartDemo,
  'slope-chart': SlopeChartDemo,
};
