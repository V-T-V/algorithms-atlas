// =============================================================================
// 有界背包 · 录制帧序列
// 用单行 grid 展示 dp[w]（容量 w 处的最大价值）；当前更新 'compare'，最大值 'final'。
// 用 setAux 展示当前二进制组与物品信息。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { boundedKnapsack, type BoundedItem, type BoundedKnapsackHooks } from './impl.ts';

export const DEFAULT_INPUT: { items: BoundedItem[]; capacity: number } = {
  items: [
    { weight: 2, value: 3, count: 4 },
    { weight: 3, value: 4, count: 2 },
    { weight: 4, value: 5, count: 3 },
  ],
  capacity: 10,
};

/** 录制演示帧序列。 */
export function buildTrace(
  input: { items: BoundedItem[]; capacity: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { items, capacity } = input;
  const cap = capacity;

  const dp: number[] = new Array<number>(cap + 1).fill(0);
  let curW = -1;
  let curItem = -1;
  let curPack = '';

  const renderGrid = (): Cell[][] => {
    const header: Cell[] = [{ v: '容量 w', role: 'default' }];
    for (let w = 0; w <= cap; w++) header.push({ v: w, role: 'pivot' });
    const row: Cell[] = [{ v: 'dp[w]', role: 'pivot' }];
    let best = 0;
    for (let w = 0; w <= cap; w++) best = Math.max(best, dp[w]!);
    for (let w = 0; w <= cap; w++) {
      let role: BarRole = 'default';
      if (w === cap) role = 'final';
      else if (curW === w) role = 'compare';
      row.push({ v: dp[w]!, role });
    }
    return [header, row];
  };

  const snapshot = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGrid(renderGrid())
      .setAux([
        { label: '当前物品 / item', value: curItem >= 0 ? `#${curItem}` : '—', role: 'compare' },
        { label: '当前打包组 / pack', value: curPack, role: 'frontier' },
      ])
      .commit();
  };

  snapshot({
    zh: `容量 ${cap}，${items.length} 种物品`,
    en: `Capacity ${cap}, ${items.length} item types`,
  });

  const hooks: BoundedKnapsackHooks = {
    onSplit: (itemIdx, _g, pw, pv) => {
      curItem = itemIdx;
      curPack = `w=${pw}, v=${pv}`;
      snapshot({
        zh: `物品 ${itemIdx} 拆出组：w=${pw}, v=${pv}`,
        en: `Item ${itemIdx} split: w=${pw}, v=${pv}`,
      });
    },
    onPackUpdate: (w, val) => {
      dp[w] = val;
      curW = w;
      snapshot({ zh: `dp[${w}] = ${val}`, en: `dp[${w}] = ${val}` });
    },
  };

  const result = boundedKnapsack(items, capacity, hooks);

  curW = -1;
  rec
    .begin({ zh: `最大价值 = ${result}`, en: `Max value = ${result}` })
    .setGrid(renderGrid())
    .setAux([{ label: '最大价值 / max', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
