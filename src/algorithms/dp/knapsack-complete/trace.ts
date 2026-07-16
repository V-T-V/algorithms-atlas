// =============================================================================
// 完全背包 · 录制帧序列
// 用二维 grid 展示 dp 表：行 = 物品前缀 i，列 = 容量 w。
// 当前填格 'compare'，选了第 i 件 'frontier'，最优值格 'final'。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { knapsackComplete, reconstructCounts, type KnapsackItem } from './impl.ts';

export const DEFAULT_INPUT: { items: KnapsackItem[]; capacity: number } = {
  items: [
    { weight: 2, value: 3 },
    { weight: 3, value: 4 },
    { weight: 4, value: 5 },
    { weight: 5, value: 8 },
  ],
  capacity: 10,
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
  let tookAt: string | null = null;
  const finalCells = new Set<string>(); // 最终最优路径
  const chosenCounts = new Array<number>(n).fill(0);

  const renderGrid = (): Cell[][] => {
    const grid: Cell[][] = [];
    const header: Cell[] = [{ v: 'i\\w', role: 'default' }];
    for (let w = 0; w <= capacity; w++) header.push({ v: w, role: 'pivot' });
    grid.push(header);
    for (let i = 0; i <= n; i++) {
      const row: Cell[] = [{ v: i === 0 ? '∅' : `#${i}`, role: 'pivot' }];
      for (let w = 0; w <= capacity; w++) {
        const key = `${i},${w}`;
        let role: BarRole = 'default';
        if (finalCells.has(key)) role = 'final';
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
      value: `w=${it.weight}, v=${it.value} ×${chosenCounts[idx]}`,
      role: chosenCounts[idx]! > 0 ? 'final' : 'default',
    }));

  const snapshot = (note: { zh: string; en: string }): void => {
    rec.begin(note).setGrid(renderGrid()).setAux(auxItems()).commit();
  };

  snapshot({
    zh: `完全背包：容量 ${capacity}，物品 ${n} 件（可重复选）`,
    en: `Complete knapsack: capacity ${capacity}, ${n} items (repeatable)`,
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
              zh: `dp[${i}][${w}] = ${val}（选物品 ${i}：从 dp[${i}][${w - items[i - 1]!.weight}]+${items[i - 1]!.value}）`,
              en: `dp[${i}][${w}] = ${val} (take item ${i}: dp[${i}][${w - items[i - 1]!.weight}]+${items[i - 1]!.value})`,
            }
          : {
              zh: `dp[${i}][${w}] = ${val}（不选物品 ${i}，沿用 dp[${i - 1}][${w}]）`,
              en: `dp[${i}][${w}] = ${val} (skip item ${i}, = dp[${i - 1}][${w}])`,
            },
      );
    },
  };

  const result = knapsackComplete(items, capacity, hooks);

  // 回溯选取次数并标记最优路径
  const counts = reconstructCounts(items, capacity, result.dp);
  for (let idx = 0; idx < n; idx++) chosenCounts[idx] = counts[idx]!;
  // 在 dp 表上标记回溯经过的格子
  {
    let w = capacity;
    let i = n;
    while (i >= 1 && w > 0) {
      finalCells.add(`${i},${w}`);
      if (result.dp[i]![w]! !== result.dp[i - 1]![w]!) {
        w -= items[i - 1]!.weight;
      } else {
        i--;
      }
    }
    if (n >= 1) finalCells.add(`0,${w}`);
  }

  // 终态
  curI = -1;
  curW = -1;
  tookAt = null;
  rec
    .begin({
      zh: `最大价值 ${result.value}，各物品选取 ${counts.map((c, i) => `#${i + 1}×${c}`).join(' ')}`,
      en: `Max value ${result.value}, counts ${counts.map((c, i) => `#${i + 1}×${c}`).join(' ')}`,
    })
    .setGrid(renderGrid())
    .setAux(auxItems())
    .commit();

  return rec.build();
}
