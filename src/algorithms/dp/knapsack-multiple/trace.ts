// =============================================================================
// 多重背包（二进制拆分）· 录制帧序列
// 可视化：setGrid 展示滚动 dp 数组（行=当前处理的「块」，列=容量 w）；
//        setAux 展示各物品与其数量、当前块信息。
// 实现策略：先确定地预计算「每块处理完」的整行快照，再据此按序生成帧，避免依赖 hook 顺序。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { binarySplit, knapsackMultiple, type KnapsackItem, type SplitItem } from './impl.ts';

export const DEFAULT_INPUT: { items: KnapsackItem[]; capacity: number } = {
  items: [
    { weight: 2, value: 3, count: 3 },
    { weight: 3, value: 4, count: 2 },
    { weight: 4, value: 5, count: 1 },
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

  // 二进制拆分（确定顺序）
  const allBlocks: SplitItem[] = [];
  const splitDesc: string[] = [];
  for (let i = 0; i < n; i++) {
    const parts = binarySplit(items[i]!.count);
    splitDesc.push(`物品 ${i + 1}（数量 ${items[i]!.count}）→ ${parts.join('+')}`);
    for (const amount of parts) {
      allBlocks.push({
        src: i,
        amount,
        weight: items[i]!.weight * amount,
        value: items[i]!.value * amount,
      });
    }
  }

  // 预计算：dpRows[b] = 处理完第 b 块（0-based）后各容量的最优值；dpRows 长度 = blocks+1
  const dpRows: number[][] = [];
  {
    const dp = new Array<number>(capacity + 1).fill(0);
    dpRows.push([...dp]); // 初始（无块）
    for (const blk of allBlocks) {
      for (let w = capacity; w >= blk.weight; w--) {
        const take = dp[w - blk.weight]! + blk.value;
        if (take > dp[w]!) dp[w] = take;
      }
      dpRows.push([...dp]);
    }
  }

  // 真正跑一遍拿最优值（不带 hook）
  const result = knapsackMultiple(items, capacity);

  let curBlockIdx = -1; // 当前高亮的块（-1 表示初始态）
  let curW = -1;

  const renderGrid = (): Cell[][] => {
    const grid: Cell[][] = [];
    const header: Cell[] = [{ v: '块\\w', role: 'default' }];
    for (let w = 0; w <= capacity; w++) header.push({ v: w, role: 'pivot' });
    grid.push(header);
    // 行 0：初始
    {
      const row: Cell[] = [{ v: 'init', role: 'pivot' }];
      for (let w = 0; w <= capacity; w++) {
        let role: BarRole = 'default';
        if (curBlockIdx === -1) role = 'compare';
        row.push({ v: dpRows[0]![w]!, role });
      }
      grid.push(row);
    }
    for (let b = 0; b < allBlocks.length; b++) {
      const blk = allBlocks[b]!;
      const row: Cell[] = [
        { v: `#${blk.src + 1}×${blk.amount}\n(w${blk.weight},v${blk.value})`, role: 'pivot' },
      ];
      for (let w = 0; w <= capacity; w++) {
        let role: BarRole = 'default';
        if (curBlockIdx === b) {
          role = w === curW ? 'compare' : 'frontier';
        }
        row.push({ v: dpRows[b + 1]![w]!, role });
      }
      grid.push(row);
    }
    return grid;
  };

  const auxItems = (): Array<{ label: string; value: string; role?: BarRole }> => {
    const out: Array<{ label: string; value: string; role?: BarRole }> = items.map((it, idx) => ({
      label: `物品 ${idx + 1}`,
      value: `w=${it.weight}, v=${it.value}, 上限 ${it.count}`,
      role: curBlockIdx >= 0 && idx === allBlocks[curBlockIdx]?.src ? 'frontier' : 'default',
    }));
    const blk = curBlockIdx >= 0 ? allBlocks[curBlockIdx] : null;
    out.push({
      label: '当前块 / block',
      value: blk ? `物品#${blk.src + 1} 的 ${blk.amount} 件（w${blk.weight},v${blk.value}）` : '—',
      role: 'compare',
    });
    out.push({
      label: '当前最大价值',
      value: curBlockIdx >= 0 ? String(dpRows[curBlockIdx + 1]![capacity]!) : '0',
      role: 'final',
    });
    return out;
  };

  const snapshot = (note: { zh: string; en: string }): void => {
    rec.begin(note).setGrid(renderGrid()).setAux(auxItems()).commit();
  };

  // 初始帧
  curBlockIdx = -1;
  snapshot({
    zh: `多重背包：容量 ${capacity}，物品 ${n} 件（有限数量）。先做二进制拆分`,
    en: `Multiple knapsack: capacity ${capacity}, ${n} items (bounded). Binary-split first`,
  });

  // 拆分说明帧
  rec
    .begin({
      zh: `二进制拆分：${splitDesc.join('；')}`,
      en: `Binary split: ${splitDesc.join('; ')}`,
    })
    .setGrid(renderGrid())
    .setAux(auxItems())
    .commit();

  // 逐块展示：每块「处理完」后的整行
  for (let b = 0; b < allBlocks.length; b++) {
    curBlockIdx = b;
    curW = -1;
    const blk = allBlocks[b]!;
    snapshot({
      zh: `处理块 ${b + 1}/${allBlocks.length}：物品#${blk.src + 1}×${blk.amount}（w${blk.weight},v${blk.value}）做 0/1 更新，dp[${capacity}]=${dpRows[b + 1]![capacity]}`,
      en: `Block ${b + 1}/${allBlocks.length}: item#${blk.src + 1}×${blk.amount} (w${blk.weight},v${blk.value}) 0/1 update, dp[${capacity}]=${dpRows[b + 1]![capacity]}`,
    });
  }

  // 终态
  curBlockIdx = -1;
  curW = -1;
  rec
    .begin({ zh: `完成：最大价值 ${result}`, en: `Done: max value ${result}` })
    .setGrid(renderGrid())
    .setAux([{ label: '最大价值 / max value', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
