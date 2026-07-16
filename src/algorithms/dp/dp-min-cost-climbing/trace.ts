// =============================================================================
// 最小代价爬楼梯 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minCostClimbingStairs, type MinCostHooks } from './impl.ts';

export const DEFAULT_INPUT = [10, 15, 20];

export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  const dp: number[] = new Array<number>(n).fill(-1);
  let cur = -1;
  let ans = 0;

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = dp.map((_, i) =>
      i === cur
        ? 'compare'
        : i === n - 1 && ans > 0
          ? 'final'
          : dp[i]! < 0
            ? 'default'
            : 'frontier',
    );
    const labels: Record<number, string> = {};
    dp.forEach((v, i) => {
      labels[i] = v < 0 ? '' : `${v}`;
    });
    const bars = rec.barsFrom(input, Object.fromEntries(roles.map((r, i) => [i, r])), labels);
    rec
      .begin(note)
      .setBars(bars)
      .setAux([{ label: 'dp', value: dp.map((v) => (v < 0 ? '·' : v)).join(' '), role: 'compare' }])
      .commit();
  };

  snap({ zh: `cost = [${input.join(', ')}]`, en: `cost = [${input.join(', ')}]` });

  const hooks: MinCostHooks = {
    onStep: (i, val) => {
      dp[i] = val;
      cur = i;
      snap({ zh: `dp[${i}] = ${val}`, en: `dp[${i}] = ${val}` });
    },
    onResult: (t) => {
      ans = t;
      cur = -1;
      snap({ zh: `最小代价 = ${t}`, en: `Min cost = ${t}` });
    },
  };

  minCostClimbingStairs(input, hooks);

  rec
    .begin({ zh: `完成：${ans}`, en: `Done: ${ans}` })
    .setBars(rec.barsFrom(input))
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
