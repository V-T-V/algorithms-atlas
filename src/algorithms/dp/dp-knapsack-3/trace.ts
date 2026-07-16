// =============================================================================
// 01 背包 · 录制帧序列
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { knapsack01, type KnapsackHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  weights: [2, 3, 4, 5],
  values: [3, 4, 5, 6],
  capacity: 8,
};

export function buildTrace(
  input: { weights: number[]; values: number[]; capacity: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { weights, values, capacity } = input;
  const dp = new Array<number>(capacity + 1).fill(0);
  let curItem = -1;
  let curC = -1;

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setArray(
        [...dp],
        dp.map((_, c) => (c === curC ? 'compare' : 'default')),
        [{ index: curC < 0 ? 0 : curC, label: 'c' }],
      )
      .setAux([
        { label: '容量 W', value: String(capacity), role: 'frontier' },
        {
          label: '当前物品',
          value: curItem >= 0 ? `i=${curItem} w=${weights[curItem]} v=${values[curItem]}` : '-',
          role: 'pivot',
        },
      ])
      .commit();
  };

  snap({ zh: `n=${weights.length}, W=${capacity}`, en: `n=${weights.length}, W=${capacity}` });

  const hooks: KnapsackHooks = {
    onItem: (i) => {
      curItem = i;
      snap({
        zh: `考虑物品 i=${i} w=${weights[i]} v=${values[i]}`,
        en: `Item i=${i} w=${weights[i]} v=${values[i]}`,
      });
    },
    onUpdate: (i, c, _o, nv) => {
      dp[c] = nv;
      curC = c;
      snap({ zh: `更新 dp[${c}]=${nv}`, en: `Update dp[${c}]=${nv}` });
    },
    onDone: (best) => {
      curItem = -1;
      curC = -1;
      snap({ zh: `最优价值=${best}`, en: `Best=${best}` });
    },
  };

  const ans = knapsack01(weights, values, capacity, hooks);

  rec
    .begin({ zh: `最大价值=${ans}`, en: `Max value=${ans}` })
    .setBars(dp.map((v) => ({ value: v, role: 'final' })))
    .setAux([{ label: '最优', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
