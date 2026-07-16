import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lengthOfLCS, type LcsHooks } from './impl.ts';

export const DEFAULT_A = ['A', 'B', 'C', 'B', 'D', 'A', 'B'];
export const DEFAULT_B = ['B', 'D', 'C', 'A', 'B', 'A'];

export function buildTrace(
  a: readonly string[] = DEFAULT_A,
  b: readonly string[] = DEFAULT_B,
): Frame[] {
  const rec = new TraceRecorder();
  const n = a.length,
    m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  let ci = -1,
    cj = -1;
  rec
    .begin({ zh: `a 长度 ${n}，b 长度 ${m}`, en: `a len ${n}, b len ${m}` })
    .setGrid(dp.map((row) => row.map((v) => ({ v: String(v), role: 'default' as BarRole }))))
    .commit();
  const hooks: LcsHooks = {
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
  const ans = lengthOfLCS(a, b, hooks);
  rec
    .begin({ zh: `LCS 长度=${ans}`, en: `LCS length=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();
  return rec.build();
}
