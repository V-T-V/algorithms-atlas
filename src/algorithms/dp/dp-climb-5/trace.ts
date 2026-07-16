import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { climbStairsK, type ClimbKHooks } from './impl.ts';

export const DEFAULT_N = 7;
export const DEFAULT_K = 3;

export function buildTrace(n: number = DEFAULT_N, k: number = DEFAULT_K): Frame[] {
  const rec = new TraceRecorder();
  const dp = new Array<number>(n + 1).fill(0);
  dp[0] = 1;
  rec
    .begin({ zh: `${n} 阶，每次最多 ${k} 步`, en: `${n} steps, up to ${k}` })
    .setBars(
      dp.map((v, i) => ({
        value: v,
        role: (i === 0 ? 'sorted' : 'default') as BarRole,
        label: String(i),
      })),
    )
    .commit();
  const hooks: ClimbKHooks = {
    onStep: (i, ways) => {
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
  const ans = climbStairsK(n, k, hooks);
  rec
    .begin({ zh: `方案数=${ans}`, en: `ways=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();
  return rec.build();
}
