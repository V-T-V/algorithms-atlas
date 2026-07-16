import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { dominoTiling, type TilingHooks } from './impl.ts';

export const DEFAULT_N = 6;

export function buildTrace(n: number = DEFAULT_N): Frame[] {
  const rec = new TraceRecorder();
  const dp = new Array<number>(n + 1).fill(0);
  dp[0] = 1;
  if (n >= 1) dp[1] = 1;
  rec
    .begin({ zh: `2×${n} 网格`, en: `2x${n} board` })
    .setBars(
      dp.map((v, i) => ({
        value: v,
        role: (i < 2 ? 'sorted' : 'default') as BarRole,
        label: String(i),
      })),
    )
    .commit();
  const hooks: TilingHooks = {
    onCol: (i, ways) => {
      dp[i] = ways;
      rec
        .begin({ zh: `dp[${i}]=${ways}`, en: `dp[${i}]=${ways}` })
        .setBars(
          dp.map((v, j) => ({
            value: v,
            role: (j === i ? 'compare' : j < i ? 'sorted' : 'default') as BarRole,
            label: String(j),
          })),
        )
        .commit();
    },
  };
  const ans = dominoTiling(n, hooks);
  rec
    .begin({ zh: `方案数=${ans}`, en: `ways=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();
  return rec.build();
}
