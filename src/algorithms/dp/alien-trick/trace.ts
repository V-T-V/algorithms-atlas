// =============================================================================
// wqs 二分（Alien Trick）· 录制帧序列
// 用 setAux 展示二分过程中的 λ / count / answer；用 setBars 展示被选元素。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { alienTrick, type AlienDecide, type AlienTrickHooks } from './impl.ts';

export const DEFAULT_INPUT: { values: number[]; k: number } = {
  values: [5, 1, 9, 2, 8, 3],
  k: 3,
};

/** 录制演示帧序列。 */
export function buildTrace(input: { values: number[]; k: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { values, k } = input;
  const selected = new Set<number>();
  let curLambda = 0;
  let curLo = 0;
  let curHi = 0;

  const renderBars = () => {
    const roles: Record<number, BarRole> = {};
    selected.forEach((i) => {
      roles[i] = 'final';
    });
    return rec.barsFrom(values, roles);
  };

  const snapshot = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(renderBars())
      .setAux([
        { label: 'λ (lambda)', value: String(curLambda), role: 'pivot' },
        { label: '二分下界 lo', value: String(curLo), role: 'compare' },
        { label: '二分上界 hi', value: String(curHi), role: 'compare' },
        { label: '目标 k', value: String(k), role: 'final' },
      ])
      .commit();
  };

  snapshot({
    zh: `从 ${values.length} 个值中选恰好 ${k} 个，使和最大`,
    en: `Pick exactly ${k} of ${values.length} values for max sum`,
  });

  const hooks: AlienTrickHooks = {
    onProbe: (lambda, lo, hi) => {
      curLambda = lambda;
      curLo = lo;
      curHi = hi;
    },
    onDecide: (res: AlienDecide) => {
      // 在该 λ 下：选所有 value-λ>0 的元素，用于可视化
      selected.clear();
      values.forEach((v, i) => {
        if (v - res.lambda > 0) selected.add(i);
      });
      snapshot({
        zh: `λ=${res.lambda}：贪心选 ${res.count} 个（和 ${res.best}）${res.count >= k ? '，个数足够，λ↑' : '，个数不足，λ↓'}`,
        en: `λ=${res.lambda}: greedy picks ${res.count} (sum ${res.best})${res.count >= k ? ', enough, λ↑' : ', too few, λ↓'}`,
      });
    },
    onNarrow: (lo, hi) => {
      curLo = lo;
      curHi = hi;
    },
  };

  const answer = alienTrick(values, k, hooks);

  // 终态：按值降序取前 k 大作为「恰好 k 个」的最优解展示
  const idxByVal = values.map((v, i) => ({ v, i })).sort((a, b) => b.v - a.v);
  selected.clear();
  for (let i = 0; i < k; i++) selected.add(idxByVal[i]!.i);
  curLambda = 0;
  curLo = 0;
  curHi = 0;
  rec
    .begin({ zh: `恰好选 ${k} 个的最大和 = ${answer}`, en: `Max sum of exactly ${k} = ${answer}` })
    .setBars(renderBars())
    .setAux([{ label: '答案', value: String(answer), role: 'final' }])
    .commit();

  return rec.build();
}
