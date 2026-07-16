import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { knapsack01, type KnapHooks } from './impl.ts';

export const DEFAULT_W = [2, 3, 4, 5];
export const DEFAULT_V = [3, 4, 5, 6];
export const DEFAULT_CAP = 8;

export function buildTrace(
  weights: readonly number[] = DEFAULT_W,
  values: readonly number[] = DEFAULT_V,
  capacity: number = DEFAULT_CAP,
): Frame[] {
  const rec = new TraceRecorder();
  const dp = new Array<number>(capacity + 1).fill(0);
  rec
    .begin({
      zh: `容量 ${capacity}，物品 ${weights.length}`,
      en: `Cap ${capacity}, items ${weights.length}`,
    })
    .setBars(dp.map((v, j) => ({ value: v, role: 'default' as BarRole, label: String(j) })))
    .commit();
  const hooks: KnapHooks = {
    onUpdate: (cap, val) => {
      dp[cap] = val;
      rec
        .begin({ zh: `dp[${cap}]=${val}`, en: `dp[${cap}]=${val}` })
        .setBars(
          dp.map((v, j) => ({
            value: v,
            role: (j === cap ? 'swap' : 'default') as BarRole,
            label: String(j),
          })),
        )
        .commit();
    },
  };
  const ans = knapsack01(weights, values, capacity, hooks);
  rec
    .begin({ zh: `最大价值=${ans}`, en: `Max value=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();
  return rec.build();
}
