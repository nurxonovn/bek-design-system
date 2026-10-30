import { useEffect, useState, type ComponentType, type ReactNode } from 'react';
import {
  Countdown,
  DataExplorer,
  Gantt,
  NumberTicker,
  type DataExplorerRow,
  type GanttTask,
} from '@bek-ui/charts';

// Chart demolari (schedule): gantt, number-ticker, data-explorer.

const Stack = ({ children, wide = false }: { children: ReactNode; wide?: boolean }) => (
  <div className={`flex flex-col gap-8 w-full ${wide ? 'max-w-3xl' : 'max-w-xl'}`}>{children}</div>
);

const UZ_MONTHS = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn', 'Iyl', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];

/* ---------- gantt ---------- */

const RELEASE: GanttTask[] = [
  { id: 'research', name: 'Tadqiqot', team: 'Dizayn', start: '2026-10-01', end: '2026-10-22', progress: 1 },
  { id: 'wire', name: 'Wireframe', team: 'Dizayn', start: '2026-10-16', end: '2026-11-15', progress: 1, dependsOn: ['research'] },
  { id: 'kit', name: 'UI kit', team: 'Dizayn', start: '2026-11-08', end: '2026-12-08', progress: 0.7, dependsOn: ['wire'] },
  { id: 'api', name: 'Backend API', team: 'Dasturlash', start: '2026-11-01', end: '2026-12-31', progress: 0.55 },
  { id: 'front', name: 'Frontend', team: 'Dasturlash', start: '2026-11-16', end: '2027-01-08', progress: 0.4, dependsOn: ['kit'] },
  { id: 'qa', name: 'Test va reliz', team: 'QA', start: '2027-01-01', end: '2027-01-24', progress: 0, dependsOn: ['api', 'front'] },
];

const GANTT_LABELS = {
  task: 'Vazifa',
  team: 'Jamoa',
  start: 'Boshlanish',
  end: 'Tugash',
  progress: 'Bajarildi',
  today: 'Bugun',
  milestones: 'Muhim sanalar',
  todayLegend: 'Bugun · muhim sana',
  dependsOn: 'Avval',
  overdue: 'muddati oʻtgan',
  months: UZ_MONTHS,
};

function GanttDemo() {
  return (
    <Stack>
      <Gantt
        tasks={RELEASE}
        today="2026-12-04"
        milestones={[{ name: 'Reliz', date: '2027-01-27', task: 'qa' }]}
        labels={GANTT_LABELS}
        label="Ilova relizi: 6 vazifa, 3 jamoa, reliz 27 yanvarda"
      />
      <Gantt
        variant="progress"
        tasks={RELEASE}
        today="2026-12-04"
        milestones={[{ name: 'Reliz', date: '2027-01-27', task: 'qa' }]}
        labels={GANTT_LABELS}
        label="Reliz bajarilishi 4 dekabr holatiga: UI kit 70%, Backend API 55%"
      />
    </Stack>
  );
}

/* ---------- number-ticker ---------- */

function NumberTickerDemo() {
  const [value, setValue] = useState(12480);
  const [to] = useState(() => Date.now() + ((2 * 24 + 14) * 3600 + 37 * 60 + 9) * 1000);
  useEffect(() => {
    // Faqat haqiqiy o'zgarish kabi — har 4 soniyada kichik qadam.
    const id = setInterval(() => setValue((v) => v + 1 + (v % 3)), 4000);
    return () => clearInterval(id);
  }, []);
  return (
    <Stack>
      <NumberTicker
        value={value}
        label="Hozir onlayn oʻquvchilar"
        delta={12.4}
        context="kecha shu vaqtga nisbatan"
      />
      <Countdown
        to={to}
        label="Qabul yopilishiga"
        unitLabels={{ days: 'kun', hours: 'soat', min: 'daq', sec: 'son' }}
        leftLabel="qoldi"
        endMessage="Qabul yopildi"
      />
    </Stack>
  );
}

/* ---------- data-explorer ---------- */

const COURSES: DataExplorerRow[] = [
  { name: 'UX/UI', series: [31, 33, 34, 36, 37, 39, 40, 42, 43, 45, 46, 48.2], value: 48200, share: 0.92, delta: 12.4 },
  { name: 'Frontend', series: [33, 34, 35, 35, 36, 37, 38, 39, 39, 40, 41, 42.1], value: 42100, share: 0.8, delta: 8.1 },
  { name: 'Data', series: [24, 25, 27, 28, 29, 30, 31, 33, 34, 35, 36, 37.4], value: 37400, share: 0.71, delta: 21.6 },
  { name: 'Ingliz tili', series: [29, 29.1, 29, 29.2, 29.1, 29.3, 29.2, 29.1, 29.3, 29.2, 29.2, 29.1], value: 29300, share: 0.56, delta: 0.4 },
  { name: 'SMM', series: [22, 21.8, 21.2, 20.9, 20.4, 20, 19.6, 19.3, 19, 18.7, 18.4, 18.1], value: 18100, share: 0.35, delta: -6.2 },
];

const EXPLORER_LABELS = {
  name: 'Kurs',
  trend: 'Trend, 12 oy',
  value: 'Oʻquvchilar',
  share: 'Ulush',
  up: 'oʻsish',
  down: 'pasayish',
  neutral: 'barqaror',
};

function DataExplorerDemo() {
  return (
    <Stack>
      <DataExplorer
        rows={COURSES}
        labels={EXPLORER_LABELS}
        label="Kurslar: oʻquvchilar soni, 12 oylik trend, ulush va oʻzgarish"
      />
      <div className="w-full max-w-sm">
        <DataExplorer
          variant="compact"
          rows={COURSES}
          labels={EXPLORER_LABELS}
          label="Kurslar, ixcham: oʻquvchilar soni va oʻzgarish"
        />
      </div>
    </Stack>
  );
}

export const chartDemosSchedule: Record<string, ComponentType> = {
  gantt: GanttDemo,
  'number-ticker': NumberTickerDemo,
  'data-explorer': DataExplorerDemo,
};
