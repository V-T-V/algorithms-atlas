import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mergeStones, type StoneHooks } from './impl.ts';

export const DEFAULT_INPUT = [3, 1, 4, 1, 5];

export function buildTrace(stones: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = stones.length;
  const dp: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  rec
    .begin({ zh: `${n} 堆石子`, en: `${n} piles` })
    .setBars(stones.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  const hooks: StoneHooks = {
    onInterval: (i, j, val) => {
      dp[i]![j] = val;
      rec
        .begin({ zh: `dp[${i}][${j}]=${val}`, en: `dp[${i}][${j}]=${val}` })
        .setBars(
          stones.map((v, k) => ({
            value: v,
            role: (k >= i && k <= j ? 'frontier' : 'default') as BarRole,
          })),
        )
        .setAux([{ label: `dp[${i}..${j}]`, value: String(val), role: 'compare' }])
        .commit();
    },
  };
  const ans = mergeStones(stones, hooks);
  rec
    .begin({ zh: `最小代价=${ans}`, en: `Min cost=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();
  return rec.build();
}
