// =============================================================================
// 分治DP · 录制帧序列
// 用 setBars 展示序列，用 setGrid 展示 dp[i] 与决策 opt[i] 的对应关系。
// 当前求解层标 'compare'，中点标 'pivot'，已确定标 'final'。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { divideConquerDp, type DivideConquerDpHooks } from './impl.ts';

export const DEFAULT_INPUT = { n: 6, values: [3, 1, 4, 1, 5, 9] };

/** 录制演示帧序列。 */
export function buildTrace(input: { n: number; values: number[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { n, values } = input;
  if (n <= 0) {
    rec.begin({ zh: '空序列', en: 'Empty sequence' }).commit();
    return rec.build();
  }

  // 前缀和；段代价 cost(l,r) = 段内元素和 + 段长（两者皆可加，满足 Monge 性质，
  // 因此最优决策点关于位置单调，分治优化结果正确）
  const pref = new Array<number>(n + 1).fill(0);
  for (let i = 0; i < n; i++) pref[i + 1] = pref[i]! + values[i]!;
  const cost = (l: number, r: number): number => {
    const sum = pref[r + 1]! - pref[l]!;
    return sum + (r - l + 1);
  };

  let curMid = -1;
  const solved = new Set<number>();
  let curRange: { lo: number; hi: number } | null = null;

  const renderBars = () => {
    const roles: Record<number, BarRole> = {};
    if (curRange) {
      // 当前求解层对应的序列下标
      for (let i = curRange.lo - 1; i <= curRange.hi - 1 && i < n; i++) {
        if (i >= 0) roles[i] = 'compare';
      }
    }
    if (curMid > 0 && curMid - 1 < n) roles[curMid - 1] = 'pivot';
    return rec.barsFrom(values, roles);
  };

  const renderGrid = (): Cell[][] => {
    const grid: Cell[][] = [];
    grid.push([
      { v: 'i', role: 'default' },
      { v: 'dp[i]', role: 'default' },
      { v: 'opt[i]', role: 'default' },
    ]);
    for (let i = 0; i <= n; i++) {
      let role: BarRole = 'default';
      if (solved.has(i)) role = 'final';
      else if (i === curMid) role = 'pivot';
      grid.push([
        { v: i, role },
        { v: '·', role },
        { v: '·', role },
      ]);
    }
    return grid;
  };

  const snapshot = (note: { zh: string; en: string }): void => {
    rec.begin(note).setBars(renderBars()).setGrid(renderGrid()).commit();
  };

  snapshot({ zh: `分治 DP：长度 ${n} 的序列`, en: `Divide-conquer DP on length ${n}` });

  let dpResult: number[] = [0];
  let optResult: number[] = [0];
  const hooks: DivideConquerDpHooks = {
    onSolve: (lo, hi) => {
      curRange = { lo, hi };
      snapshot({ zh: `求解位置 [${lo}, ${hi}]`, en: `Solve positions [${lo}, ${hi}]` });
    },
    onFill: (mid, opt, val) => {
      dpResult[mid] = val;
      optResult[mid] = opt;
      curMid = mid;
      solved.add(mid);
      snapshot({
        zh: `dp[${mid}] = ${val}（决策点 opt=${opt}）`,
        en: `dp[${mid}] = ${val} (opt=${opt})`,
      });
    },
  };

  const result = divideConquerDp(n, cost, hooks);
  dpResult = result.dp;
  optResult = result.opt;

  curMid = -1;
  curRange = null;
  // 终态 grid 用真实值
  const grid: Cell[][] = [
    [
      { v: 'i', role: 'default' },
      { v: 'dp[i]', role: 'default' },
      { v: 'opt[i]', role: 'default' },
    ],
  ];
  for (let i = 0; i <= n; i++) {
    grid.push([
      { v: i, role: 'final' },
      { v: dpResult[i]!, role: 'final' },
      { v: optResult[i]!, role: 'final' },
    ]);
  }
  rec
    .begin({ zh: `完成，dp[${n}] = ${dpResult[n]}`, en: `Done, dp[${n}] = ${dpResult[n]}` })
    .setBars(values.map((v) => ({ value: v, role: 'final' as BarRole })))
    .setGrid(grid)
    .commit();

  return rec.build();
}
