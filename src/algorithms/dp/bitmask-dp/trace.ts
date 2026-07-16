// =============================================================================
// 状压 DP（TSP）· 录制帧序列
// 用 setGrid 展示 dp 表（行=mask 的已访问集合，列=终点城市）；
// 当前填的格标 'compare'，最终回溯路径上的格标 'final'。
// 用 setAux 展示当前最优值与路径。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bitmaskDp, type BitmaskDpHooks, type TspInput } from './impl.ts';

/** 演示：4 城市对称 TSP，最优 = 80。 */
export const DEFAULT_INPUT: TspInput = {
  dist: [
    [0, 10, 15, 20],
    [10, 0, 35, 25],
    [15, 35, 0, 30],
    [20, 25, 30, 0],
  ],
};

const INF = '∞';
const fmt = (v: number): string | number => (Number.isFinite(v) ? v : INF);
const popcount = (x: number): number => {
  let c = 0;
  while (x) {
    x &= x - 1;
    c++;
  }
  return c;
};

/** 录制演示帧序列。 */
export function buildTrace(input: TspInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const dist = input.dist;
  const n = dist.length;
  const start = input.start ?? 0;
  const full = (1 << n) - 1;

  // dp 表快照：mask 行 → 各终点列；未求值记 -1
  const dp: number[][] = Array.from({ length: 1 << n }, () => new Array<number>(n).fill(Infinity));
  // 仅显示「有意义」的行：含 start 且 mask 合法。为可读，按 popcount 分组列出。
  let curMask = -1;
  let curLast = -1;
  const pathCells = new Set<string>(); // "mask,last"
  let best = Infinity;

  /** 选出展示的行：按 popcount 升序，含 start 的所有 mask。 */
  const displayMasks: number[] = [];
  for (let m = 0; m <= full; m++) {
    if (m & (1 << start)) displayMasks.push(m);
  }
  displayMasks.sort((a, b) => popcount(a) - popcount(b) || a - b);

  const renderGrid = (): Cell[][] => {
    const grid: Cell[][] = [];
    // 表头：mask | 终点 0..n-1
    const header: Cell[] = [{ v: 'mask\\last', role: 'default' }];
    for (let j = 0; j < n; j++) header.push({ v: `${j}${j === start ? '*' : ''}`, role: 'pivot' });
    grid.push(header);
    for (const m of displayMasks) {
      const subset = [...Array(n).keys()].filter((i) => m & (1 << i)).join(',');
      const row: Cell[] = [{ v: `${m.toString(2).padStart(n, '0')} {${subset}}`, role: 'pivot' }];
      for (let i = 0; i < n; i++) {
        if (!(m & (1 << i))) {
          row.push({ v: '·', role: 'default' });
          continue;
        }
        let role: BarRole = 'default';
        if (curMask === m && curLast === i) role = 'compare';
        else if (pathCells.has(`${m},${i}`)) role = 'final';
        const val = dp[m]![i]!;
        row.push({ v: val === Infinity ? INF : val, role });
      }
      grid.push(row);
    }
    return grid;
  };

  const snapshot = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGrid(renderGrid())
      .setAux([
        {
          label: '当前状态 / state',
          value:
            curMask < 0 ? '—' : `mask=${curMask.toString(2).padStart(n, '0')}, last=${curLast}`,
          role: 'compare',
        },
        {
          label: '当前最优 / best',
          value: Number.isFinite(best) ? String(best) : '∞',
          role: 'final',
        },
      ])
      .commit();
  };

  snapshot({ zh: `TSP：${n} 城市，起点 ${start}`, en: `TSP: ${n} cities, start ${start}` });

  const hooks: BitmaskDpHooks = {
    onState: (mask, last) => {
      curMask = mask;
      curLast = last;
    },
    onTransition: (prevMask, prev, mask, last, candidate) => {
      curMask = mask;
      curLast = last;
      // 暂记候选值用于显示
      if (candidate < dp[mask]![last]!) dp[mask]![last] = candidate;
      snapshot({
        zh: `从 {mask=${prevMask.toString(2).padStart(n, '0')}, ${prev}} 经边 ${prev}→${last}(=${dist[prev]![last]}) 扩展，候选 ${fmt(candidate)}`,
        en: `Extend {mask=${prevMask.toString(2).padStart(n, '0')}, ${prev}} via ${prev}→${last} (=${dist[prev]![last]}), candidate ${fmt(candidate)}`,
      });
    },
    onSolve: (mask, last, value) => {
      dp[mask]![last] = value;
      curMask = mask;
      curLast = last;
    },
    onDone: (b) => {
      best = b;
    },
  };

  const result = bitmaskDp(input, hooks);

  // 标记回溯路径在 dp 表上的格子
  if (result.path.length && Number.isFinite(result.best)) {
    // 由 path 还原每步的 mask：path 形如 [start, a, b, ..., start]
    let m = 1 << start;
    for (let k = 1; k < result.path.length; k++) {
      const city = result.path[k]!;
      if (k < result.path.length - 1) {
        // 中间城市：mask 含 start..city
        m |= 1 << city;
        pathCells.add(`${m},${city}`);
      }
    }
  }

  curMask = -1;
  curLast = -1;
  rec
    .begin({
      zh: Number.isFinite(result.best)
        ? `最短回路 = ${result.best}，路径 ${result.path.join('→')}`
        : '不存在回路',
      en: Number.isFinite(result.best)
        ? `Shortest tour = ${result.best}, path ${result.path.join('→')}`
        : 'No tour exists',
    })
    .setGrid(renderGrid())
    .setAux([
      {
        label: '最短回路 / best',
        value: Number.isFinite(result.best) ? String(result.best) : '∞',
        role: 'final',
      },
      { label: '路径 / path', value: result.path.join(' → '), role: 'frontier' },
    ])
    .commit();

  return rec.build();
}
