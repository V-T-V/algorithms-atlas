// =============================================================================
// 状压进阶（多米诺铺砖 · 轮廓线 DP）· 录制帧序列
// 可视化：setGrid 展示「轮廓线状态 → 方案数」表（行=profile 二进制，列=count）；
//        setAux 展示当前格 (i,j) 与轮廓线各位。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { stateCompression, type StateCompressionHooks, type TilingInput } from './impl.ts';

/** 演示：3×3 棋盘铺砖方案数 = 0（奇数格无法铺满）。改用 3×4 = 11。 */
export const DEFAULT_INPUT: TilingInput = { rows: 3, cols: 4 };

/** 录制演示帧序列。 */
export function buildTrace(input: TilingInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { rows: n, cols: m } = input;
  const full = 1 << m;

  // 当前 dp（profile -> 方案数）
  const dp = new Array<number>(full).fill(0);
  dp[0] = 1;
  let curI = -1;
  let curJ = -1;
  let curPrev = -1;
  let curNext = -1;

  const fmtProfile = (p: number): string => p.toString(2).padStart(m, '0');

  const renderGrid = (): Cell[][] => {
    const grid: Cell[][] = [];
    const header: Cell[] = [
      { v: 'profile', role: 'default' },
      { v: '方案数 / count', role: 'pivot' },
      { v: '轮廓位 / bits', role: 'default' },
    ];
    grid.push(header);
    for (let p = 0; p < full; p++) {
      if (dp[p] === 0) continue;
      let role: BarRole = 'default';
      if (p === curPrev) role = 'compare';
      else if (p === curNext) role = 'frontier';
      // 显示各位（高 bit 在左）
      const bits = fmtProfile(p)
        .split('')
        .map((ch, idx) => (idx === curJ ? `[${ch}]` : ch))
        .join(' ');
      grid.push([
        { v: fmtProfile(p), role },
        { v: dp[p], role },
        { v: bits, role },
      ]);
    }
    return grid;
  };

  const snapshot = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGrid(renderGrid())
      .setAux([
        { label: '棋盘 / grid', value: `${n} × ${m}（共 ${n * m} 格）` },
        {
          label: '当前格 / cell',
          value: curI < 0 ? '—' : `(${curI}, ${curJ})`,
          role: 'compare',
        },
        {
          label: '转移 / transition',
          value: curPrev < 0 ? '—' : `${fmtProfile(curPrev)} → ${fmtProfile(curNext)}`,
          role: 'frontier',
        },
      ])
      .commit();
  };

  snapshot({
    zh: `用 1×2 骨牌铺满 ${n}×${m} 棋盘：轮廓线 DP，初始 profile=${fmtProfile(0)} 方案数=1`,
    en: `Tile ${n}×${m} board with 1×2 dominoes: profile DP, init profile=${fmtProfile(0)} count=1`,
  });

  const hooks: StateCompressionHooks = {
    onTransition: (i, j, prev, next, add) => {
      curI = i;
      curJ = j;
      curPrev = prev;
      curNext = next;
      // 仅展示「有意义的」转移（避免过多帧：每格只展示首次贡献）
      const bit = 1 << j;
      const kind =
        (prev & bit) !== 0
          ? '已被上方占据（清位）'
          : j + 1 < m && next === (prev | (1 << (j + 1)))
            ? '横放（向右）'
            : '竖放（向下）';
      snapshot({
        zh: `格 (${i},${j})：${fmtProfile(prev)} → ${fmtProfile(next)}，+${add}（${kind}）`,
        en: `Cell (${i},${j}): ${fmtProfile(prev)} → ${fmtProfile(next)}, +${add}`,
      });
      // 同步 dp（next 累加）
      dp[next]! += add;
    },
    onStage: () => {
      curPrev = -1;
      curNext = -1;
    },
    onDone: () => {},
  };

  const result = stateCompression(input, hooks);

  // 终态：dp[0] 即方案数
  curI = -1;
  curJ = -1;
  curPrev = -1;
  curNext = -1;
  // 重置展示表为最终 dp（已含结果）
  rec
    .begin({
      zh: `完成：完全铺满方案数 = ${result.count}`,
      en: `Done: number of full tilings = ${result.count}`,
    })
    .setGrid([
      [
        { v: 'profile', role: 'default' },
        { v: '方案数 / count', role: 'pivot' },
      ],
      [
        { v: fmtProfile(0), role: 'final' },
        { v: result.count, role: 'final' },
      ],
    ])
    .setAux([{ label: '方案数 / tilings', value: String(result.count), role: 'final' }])
    .commit();

  return rec.build();
}
