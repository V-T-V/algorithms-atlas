// 分组背包 · 录制帧序列
// 把滚动一维 dp 表按「处理完第 g 组」逐行排成二维网格（行=组进度，列=容量 0..W），
// 并在每次 onPick 改写时高亮被更新的格子，让「每组至多选一件」的递推可视化。
//
// 说明：impl 的 hooks 没有 onGroupEnd，故本 trace 自行复刻一份等价 dp，
// 与 impl 同一递推（onPick 给出的 val 即 dp[w] 的新值），保证展示与结果一致。

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { groupKnapsack, type GKItem } from './impl.ts';

type CellRow = Array<string | number | undefined>;

export const DEFAULT_INPUT: GKItem[][] = [
  [
    { weight: 1, value: 5 },
    { weight: 2, value: 8 },
  ],
  [
    { weight: 1, value: 1 },
    { weight: 2, value: 9 },
  ],
  [
    { weight: 1, value: 3 },
    { weight: 2, value: 7 },
    { weight: 4, value: 4 },
    { weight: 6, value: 6 },
  ],
];

const CAPACITY = 4;

export function buildTrace(input: GKItem[][] = DEFAULT_INPUT, capacity: number = CAPACITY): Frame[] {
  const rec = new TraceRecorder();
  const W = capacity;
  const nGroups = input.length;

  // history[0] = 初始全 0；history[g+1] = 处理完第 g 组后的 dp 快照
  const history: number[][] = [new Array<number>(W + 1).fill(0)];
  const dp = new Array<number>(W + 1).fill(0);
  let currentGroup = -1;
  let lastPick: { g: number; w: number } | null = null;

  const renderGrid = (): Cell[][] => {
    const rows: CellRow[] = [];
    const roles: Record<string, BarRole> = {};
    const header: CellRow = ['g\\w'];
    for (let w = 0; w <= W; w++) header.push(w);
    rows.push(header);
    for (let g = -1; g <= currentGroup; g++) {
      const snap = history[g + 1]!;
      const row: CellRow = [g < 0 ? '初始' : `G${g}`];
      for (let w = 0; w <= W; w++) {
        row.push(snap[w]);
        const r = `${rows.length},${w + 1}`;
        if (lastPick && lastPick.g === g && lastPick.w === w) roles[r] = 'swap';
        else if (g === currentGroup) roles[r] = 'compare';
      }
      rows.push(row);
    }
    return rec.gridFrom(rows, roles);
  };

  rec
    .begin({
      zh: `${nGroups} 组物品，容量 ${W}。dp[w] = 已处理若干组、容量 w 下的最大价值。`,
      en: `${nGroups} groups, capacity ${W}. dp[w] = max value using capacity w after some groups.`,
    })
    .setAux([
      { label: '组数', value: String(nGroups), role: 'compare' },
      { label: '容量', value: String(W), role: 'pivot' },
      { label: '规则', value: '每组至多选一件', role: 'frontier' },
    ])
    .commit();

  const hooks = {
    onGroup: (g: number) => {
      // 新组开始前：把「上一组结束」时的 dp 落盘为 history 一行。
      if (g > 0) history.push([...dp]);
      currentGroup = g;
      lastPick = null;
      rec
        .begin({
          zh: `处理第 ${g} 组（${input[g]!.length} 件物品），基于上一行递推。`,
          en: `Process group ${g} (${input[g]!.length} items); roll forward from previous row.`,
        })
        .setGrid(renderGrid())
        .setAux([
          { label: '当前组', value: `G${g}`, role: 'pivot' },
          {
            label: '组内物品',
            value: input[g]!.map((it) => `(w${it.weight},v${it.value})`).join(' '),
            role: 'compare',
          },
        ])
        .commit();
    },
    onPick: (g: number, w: number, wi: number, vi: number, val: number) => {
      dp[w] = val;
      lastPick = { g, w };
      // 展示「正在构建的第 g 组行」：临时把 dp 当作 history[g+1]
      if (history.length <= g + 1) history.push([...dp]);
      else history[g + 1] = [...dp];
      rec
        .begin({
          zh: `G${g}：取 (w=${wi},v=${vi})，dp[${w}] = ${val}`,
          en: `G${g}: pick (w=${wi},v=${vi}), dp[${w}] = ${val}`,
        })
        .setGrid(renderGrid())
        .commit();
    },
    onDone: (value: number) => {
      // 最后一组结果落盘
      if (history.length <= nGroups) history.push([...dp]);
      lastPick = null;
      rec
        .begin({
          zh: `完成：容量 ${W} 下最大价值 = ${value}`,
          en: `Done: max value under capacity ${W} = ${value}`,
        })
        .setGrid(renderGrid())
        .setAux([{ label: '最大价值', value: String(value), role: 'final' }])
        .commit();
    },
  };

  // 跑一遍算法填充 dp/history（结果丢弃，trace 已记录帧）
  groupKnapsack(input, W, hooks);
  return rec.build();
}
