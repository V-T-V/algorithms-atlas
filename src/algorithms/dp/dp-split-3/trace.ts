import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { integerBreak, type SplitHooks } from './impl.ts';

export const DEFAULT_N = 10;

export function buildTrace(n: number = DEFAULT_N): Frame[] {
  const rec = new TraceRecorder();
  const dp = new Array<number>(n + 1).fill(0);
  rec
    .begin({ zh: `拆分 ${n}`, en: `Break ${n}` })
    .setBars(dp.map((v, i) => ({ value: v, role: 'default' as BarRole, label: String(i) })))
    .commit();
  const hooks: SplitHooks = {
    onNum: (i, best) => {
      dp[i] = best;
      rec
        .begin({ zh: `dp[${i}]=${best}`, en: `dp[${i}]=${best}` })
        .setBars(
          dp.map((v, j) => ({
            value: v,
            role: (j === i ? 'compare' : 'default') as BarRole,
            label: String(j),
          })),
        )
        .commit();
    },
  };
  const ans = integerBreak(n, hooks);
  rec
    .begin({ zh: `最大积=${ans}`, en: `Max product=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();
  return rec.build();
}
