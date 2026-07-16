// =============================================================================
// 露天矿开采 · 录制帧序列
// 用 setArray2d 按列+深度展示块的权重与是否选中。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { openPitMining, type MineInput } from './impl.ts';

export const DEFAULT_INPUT: MineInput = {
  cols: 3,
  depths: [3, 3, 3],
  // 按列优先，深度从浅到深
  // col0: 5, -2, 8；col1: 3, -1, 6；col2: -1, 4, 7
  weights: [5, -2, 8, 3, -1, 6, -1, 4, 7],
};

export function buildTrace(input: MineInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { cols, depths, weights } = input;
  const maxDepth = Math.max(...depths);

  // 计算每个块的 col/depth
  const colStart: number[] = [0];
  for (let c = 0; c < cols - 1; c++) colStart.push(colStart[c]! + depths[c]!);
  const idxOf = (c: number, d: number): number => colStart[c]! + d;

  const renderGrid = (
    mined: Set<number>,
    note: { zh: string; en: string },
    aux: Array<{ label: string; value: string; role?: BarRole }>,
  ): void => {
    // grid[row][col]，row=0 是最浅（地表），向下加深
    const grid: Cell[][] = [];
    for (let d = 0; d < maxDepth; d++) {
      const row: Cell[] = [];
      for (let c = 0; c < cols; c++) {
        if (d < depths[c]!) {
          const i = idxOf(c, d);
          const w = weights[i]!;
          const isMined = mined.has(i);
          row.push({
            v: `${w >= 0 ? '+' : ''}${w}${isMined ? '*' : ''}`,
            role: (w > 0
              ? isMined
                ? 'final'
                : 'frontier'
              : isMined
                ? 'warn'
                : 'default') as BarRole,
          });
        } else {
          row.push({ v: '', role: 'default' as BarRole });
        }
      }
      grid.push(row);
    }
    rec.begin(note).setGrid(grid).setAux(aux).commit();
  };

  renderGrid(
    new Set(),
    {
      zh: `矿体：${cols} 列 × 最深 ${maxDepth}，每块权重 = 收益 − 成本（+ 正，− 负）`,
      en: `Ore body: ${cols} cols × max depth ${maxDepth}, weight = revenue − cost`,
    },
    [{ label: '块数', value: String(weights.length), role: 'pivot' as BarRole }],
  );

  let positiveSum = 0;
  let minCut = 0;
  let profit = 0;

  openPitMining(input, {
    onBuildGraph: (nodeCount, source, sink, edgeCount, pos) => {
      positiveSum = pos;
      rec
        .begin({
          zh: `建闭合子图网络：${nodeCount} 节点（源=${source}，汇=${sink}），${edgeCount} 边；正权之和 ${pos}`,
          en: `Build closure network: ${nodeCount} nodes, ${edgeCount} edges; positive-sum ${pos}`,
        })
        .setAux([
          { label: '节点数', value: String(nodeCount), role: 'frontier' as BarRole },
          { label: '正权之和', value: String(pos), role: 'final' as BarRole },
        ])
        .commit();
    },
    onAugment: (flow) => {
      rec
        .begin({
          zh: `增广：当前流（割容量） ${flow}`,
          en: `Augment: current flow (cut) ${flow}`,
        })
        .setAux([{ label: '当前流', value: String(flow), role: 'pivot' as BarRole }])
        .commit();
    },
    onDone: (r) => {
      minCut = r.minCut;
      profit = r.maxProfit;
    },
  });

  // 重建选中集合（再 BFS 一次的代价高，这里从 mined 反推）
  // 我们用 result 重新调用，但只取 mined
  const result = openPitMining(input);
  const mined = new Set<number>(result.mined);

  renderGrid(
    mined,
    {
      zh: `完成：最大利润 ${profit} = 正权和 ${positiveSum} − 最小割 ${minCut}（* 表示选中开采）`,
      en: `Done: max profit ${profit} = pos-sum ${positiveSum} − min-cut ${minCut} (* = mined)`,
    },
    [
      { label: '最大利润', value: String(profit), role: 'final' as BarRole },
      { label: '正权和', value: String(positiveSum), role: 'frontier' as BarRole },
      { label: '最小割', value: String(minCut), role: 'pivot' as BarRole },
      { label: '挖块数', value: String(mined.size), role: 'final' as BarRole },
    ],
  );

  return rec.build();
}
