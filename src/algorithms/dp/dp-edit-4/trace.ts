import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { editDistance, type EditDistHooks } from './impl.ts';

export const DEFAULT_A = 'horse';
export const DEFAULT_B = 'ros';

export function buildTrace(a: string = DEFAULT_A, b: string = DEFAULT_B): Frame[] {
  const rec = new TraceRecorder();
  const n = a.length,
    m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, (_, i) => {
    const row = new Array<number>(m + 1);
    for (let j = 0; j <= m; j++) row[j] = i === 0 ? j : 0;
    if (i > 0) row[0] = i;
    return row;
  });
  let ci = -1,
    cj = -1;
  rec
    .begin({ zh: `${a} → ${b}`, en: `${a} -> ${b}` })
    .setGrid(dp.map((row) => row.map((v) => ({ v: String(v), role: 'default' as BarRole }))))
    .setAux([
      { label: 'a', value: a, role: 'frontier' },
      { label: 'b', value: b, role: 'frontier' },
    ])
    .commit();
  const hooks: EditDistHooks = {
    onCell: (i, j, val) => {
      dp[i]![j] = val;
      ci = i;
      cj = j;
      rec
        .begin({ zh: `dp[${i}][${j}]=${val}`, en: `dp[${i}][${j}]=${val}` })
        .setGrid(
          dp.map((row, r) =>
            row.map((v, c) => ({
              v: String(v),
              role: (r === ci && c === cj ? 'compare' : 'default') as BarRole,
            })),
          ),
        )
        .commit();
    },
  };
  const ans = editDistance(a, b, hooks);
  rec
    .begin({ zh: `编辑距离=${ans}`, en: `Edit distance=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();
  return rec.build();
}
