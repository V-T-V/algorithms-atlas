// =============================================================================
// 0/1 背包 · 录制帧序列
// 用二维 grid 展示 dp 表：行 = 物品前缀 i，列 = 容量 w。
// 当前填格标 'compare'，选了第 i 件标 'frontier'，回溯路径标 'final'。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { knapsack01, type KnapsackItem } from './impl.ts';

export const DEFAULT_INPUT: { items: KnapsackItem[]; capacity: number } = {
  items: [
    { weight: 2, value: 3 },
    { weight: 3, value: 4 },
    { weight: 4, value: 5 },
    { weight: 5, value: 8 },
  ],
  capacity: 8,
};

/** 录制演示帧序列。 */
export function buildTrace(
  input: { items: KnapsackItem[]; capacity: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { items, capacity } = input;
  const n = items.length;

  // dp 表：(n+1) x (capacity+1)，未填记 -1，第 0 行恒 0
  const dp: number[][] = Array.from({ length: n + 1 }, (_, i) =>
    new Array<number>(capacity + 1).fill(i === 0 ? 0 : -1),
  );

  let curI = -1;
  let curW = -1;
  let tookAt: string | null = null; // "i,w" 当前帧选了某件
  const walkPath = new Set<string>(); // 回溯路径 "i,w"
  const chosenSet = new Set<number>(); // 被选物品下标

  /** 渲染带表头的 grid。 */
  const renderGrid = (): Cell[][] => {
    const grid: Cell[][] = [];
    // 表头：左上角 i\w + 容量 0..capacity
    const header: Cell[] = [{ v: 'i\\w', role: 'default' }];
    for (let w = 0; w <= capacity; w++) header.push({ v: w, role: 'pivot' });
    grid.push(header);
    for (let i = 0; i <= n; i++) {
      const row: Cell[] = [{ v: i === 0 ? '∅' : `#${i}`, role: 'pivot' }];
      for (let w = 0; w <= capacity; w++) {
        const key = `${i},${w}`;
        let role: BarRole = 'default';
        if (walkPath.has(key)) role = 'final';
        else if (tookAt === key) role = 'frontier';
        else if (curI === i && curW === w) role = 'compare';
        row.push({ v: dp[i]![w]! < 0 ? '·' : dp[i]![w]!, role });
      }
      grid.push(row);
    }
    return grid;
  };

  const auxItems = (): Array<{ label: string; value: string; role?: BarRole }> =>
    items.map((it, idx) => ({
      label: `物品 ${idx + 1}`,
      value: `w=${it.weight}, v=${it.value}`,
      role: chosenSet.has(idx) ? 'final' : 'default',
    }));

  const snapshot = (note: { zh: string; en: string }): void => {
    rec.begin(note).setGrid(renderGrid()).setAux(auxItems()).commit();
  };

  snapshot({
    zh: `背包容量 ${capacity}，物品 ${n} 件`,
    en: `Capacity ${capacity}, ${n} items`,
  });

  const hooks = {
    onFillCell: (i: number, w: number, val: number, from: 'take' | 'skip') => {
      dp[i]![w] = val;
      curI = i;
      curW = w;
      tookAt = from === 'take' ? `${i},${w}` : null;
      snapshot(
        from === 'take'
          ? {
              zh: `dp[${i}][${w}] = ${val}（选入物品 ${i}：w=${items[i - 1]!.weight}, v=${items[i - 1]!.value}）`,
              en: `dp[${i}][${w}] = ${val} (take item ${i}: w=${items[i - 1]!.weight}, v=${items[i - 1]!.value})`,
            }
          : {
              zh: `dp[${i}][${w}] = ${val}（不选物品 ${i}，沿用 dp[${i - 1}][${w}]）`,
              en: `dp[${i}][${w}] = ${val} (skip item ${i}, = dp[${i - 1}][${w}])`,
            },
      );
    },
    onBacktrack: (i: number, w: number, item: number, taken: boolean) => {
      walkPath.add(`${i},${w}`);
      if (taken) chosenSet.add(item);
      curI = -1;
      curW = -1;
      tookAt = null;
      snapshot(
        taken
          ? {
              zh: `回溯 (${i},${w})：物品 ${item + 1} 被选入`,
              en: `Backtrack (${i},${w}): item ${item + 1} was taken`,
            }
          : {
              zh: `回溯 (${i},${w})：物品 ${item + 1} 未选`,
              en: `Backtrack (${i},${w}): item ${item + 1} not taken`,
            },
      );
    },
  };

  const result = knapsack01(items, capacity, hooks);

  // 终态
  rec
    .begin({
      zh: `最大价值 ${result.value}，选入物品 [${result.chosen.map((k) => k + 1).join(', ')}]`,
      en: `Max value ${result.value}, chosen items [${result.chosen.map((k) => k + 1).join(', ')}]`,
    })
    .setGrid(renderGrid())
    .setAux(auxItems())
    .commit();

  return rec.build();
}
