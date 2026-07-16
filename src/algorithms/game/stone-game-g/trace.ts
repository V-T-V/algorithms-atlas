// =============================================================================
// 石子游戏 · 录制帧序列
// 可视化：setGrid 渲染 dp 表；setAux 展示当前区间与取法。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { stoneGame, type StoneGameGHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 3, 4, 5];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  const dp: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  for (let i = 0; i < n; i++) dp[i]![i]! = input[i]!;

  const renderGrid = (hi: number, hj: number, takeLeft: boolean | null): Cell[][] => {
    return dp.map((row, i) =>
      row.map((v, j) => {
        const filled = j >= i;
        let role: BarRole = 'default';
        if (filled) {
          if (i === hi && j === hj) role = takeLeft ? 'pivot' : 'swap';
          else role = 'sorted';
        }
        return { v: filled ? v : '', role };
      }),
    );
  };

  rec
    .begin({
      zh: `石子游戏：piles=[${input.join(', ')}]，区间 DP 求先手最大分差`,
      en: `Stone Game: piles=[${input.join(', ')}], interval DP for max gap`,
    })
    .setGrid(renderGrid(-1, -1, null))
    .setAux([
      { label: 'piles', value: `[${input.join(', ')}]`, role: 'default' },
      { label: '规则', value: 'dp[i][j]=max(p[i]-dp[i+1][j], p[j]-dp[i][j-1])', role: 'pivot' },
    ])
    .commit();

  const hooks: StoneGameGHooks = {
    onInterval: (i, j, gap, takeLeft) => {
      dp[i]![j]! = gap;
      rec
        .begin({
          zh: `区间 [${i}..${j}]：分差=${gap}，取${takeLeft ? '左' : '右'}端（piles[${takeLeft ? i : j}]=${takeLeft ? input[i] : input[j]}）`,
          en: `Interval [${i}..${j}]: gap=${gap}, take ${takeLeft ? 'left' : 'right'}`,
        })
        .setGrid(renderGrid(i, j, takeLeft))
        .setAux([
          { label: '区间', value: `[${i}..${j}]`, role: 'pivot' },
          {
            label: '取法',
            value: takeLeft ? '左端' : '右端',
            role: takeLeft ? 'pivot' : ('swap' as BarRole),
          },
          { label: '分差', value: String(gap), role: 'compare' },
        ])
        .commit();
    },
  };

  const result = stoneGame(input, hooks);

  rec
    .begin({
      zh: `完成：Alex 最大分差 = ${result.gap}（${result.alexWins ? 'Alex 赢' : 'Lee 赢/平'}）`,
      en: `Done: Alex max gap = ${result.gap} (${result.alexWins ? 'Alex wins' : 'Lee wins/tie'})`,
    })
    .setGrid(renderGrid(-1, -1, null))
    .setAux([
      {
        label: 'Alex 必胜？',
        value: result.alexWins ? '是' : '否',
        role: result.alexWins ? 'final' : ('warn' as BarRole),
      },
      { label: '最大分差', value: String(result.gap), role: 'final' },
    ])
    .commit();

  return rec.build();
}
