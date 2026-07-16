// =============================================================================
// 最大休假天数 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maxVacationDays, type MaximumVacationHooks } from './impl.ts';

export const DEFAULT_FLIGHTS = [
  [0, 1, 1],
  [1, 0, 1],
  [1, 1, 0],
];
export const DEFAULT_DAYS = [
  [1, 3, 1],
  [6, 0, 3],
  [3, 3, 3],
];

export function buildTrace(
  flights: number[][] = DEFAULT_FLIGHTS,
  days: number[][] = DEFAULT_DAYS,
): Frame[] {
  const rec = new TraceRecorder();
  const n = flights.length;
  const K = days[0]!.length;
  let ans = 0;

  const snap = (note: { zh: string; en: string }, dp: number[], w: number): void => {
    const roles: BarRole[] = dp.map((v, _c) =>
      w === K - 1 && v === Math.max(...dp) ? 'final' : v === -Infinity ? 'default' : 'frontier',
    );
    const labels: Record<number, string> = {};
    dp.forEach((v, c) => (labels[c] = v === -Infinity ? '-∞' : `${v}`));
    rec
      .begin(note)
      .setBars(days.map((row, c) => ({ value: row[w] ?? 0, role: roles[c]!, label: labels[c] })))
      .setAux([
        {
          label: `第 ${w} 周 dp`,
          value: dp.map((v) => (v === -Infinity ? '-∞' : v)).join(' '),
          role: 'frontier',
        },
      ])
      .commit();
  };

  snap({ zh: `n=${n} 城 K=${K} 周`, en: `n=${n} cities, K=${K} weeks` }, new Array(n).fill(0), -1);

  const hooks: MaximumVacationHooks = {
    onWeek: (w, dpArr) => snap({ zh: `第 ${w} 周结束 dp`, en: `After week ${w}` }, dpArr, w),
    onResult: (t) => {
      ans = t;
    },
  };

  const result = maxVacationDays(flights, days, hooks);

  rec
    .begin({ zh: `完成：${result}`, en: `Done: ${result}` })
    .setBars(
      days.map((row) => ({ value: row.reduce((a, b) => a + b, 0), role: 'final' as BarRole })),
    )
    .setAux([{ label: '休假天数', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
