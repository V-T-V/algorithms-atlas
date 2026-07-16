// =============================================================================
// 预测赢家 · 录制帧序列
// 可视化：setGrid 渲染 dp 表；setAux 展示区间与取法。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { predictTheWinner, type PredictTheWinnerHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 5, 2];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  const dp: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  for (let i = 0; i < n; i++) dp[i]![i]! = input[i]!;

  const renderGrid = (hi: number, hj: number): Cell[][] =>
    dp.map((row, i) =>
      row.map((v, j) => {
        const filled = j >= i;
        let role: BarRole = 'default';
        if (filled) role = i === hi && j === hj ? 'pivot' : 'sorted';
        return { v: filled ? v : '', role };
      }),
    );

  rec
    .begin({
      zh: `预测赢家：nums=[${input.join(', ')}]，轮流取两端，玩家1 能否不输`,
      en: `Predict the Winner: nums=[${input.join(', ')}], P1 takes ends, can P1 not lose?`,
    })
    .setGrid(renderGrid(-1, -1))
    .setAux([{ label: 'nums', value: `[${input.join(', ')}]`, role: 'default' }])
    .commit();

  const hooks: PredictTheWinnerHooks = {
    onInterval: (i, j, gap, takeLeft) => {
      dp[i]![j]! = gap;
      rec
        .begin({
          zh: `区间 [${i}..${j}]：分差=${gap}，取${takeLeft ? '左' : '右'}端`,
          en: `Interval [${i}..${j}]: gap=${gap}, take ${takeLeft ? 'left' : 'right'}`,
        })
        .setGrid(renderGrid(i, j))
        .setAux([
          { label: '区间', value: `[${i}..${j}]`, role: 'pivot' },
          { label: '分差', value: String(gap), role: 'compare' },
        ])
        .commit();
    },
  };

  const result = predictTheWinner(input, hooks);

  rec
    .begin({
      zh: `完成：玩家1 ${result.player1Wins ? '不输' : '会输'}（分差 ${result.gap}）`,
      en: `Done: P1 ${result.player1Wins ? 'does not lose' : 'loses'} (gap ${result.gap})`,
    })
    .setGrid(renderGrid(-1, -1))
    .setAux([
      {
        label: '玩家1 赢/平？',
        value: result.player1Wins ? '是' : '否',
        role: result.player1Wins ? 'final' : ('warn' as BarRole),
      },
      { label: '分差', value: String(result.gap), role: 'final' },
    ])
    .commit();

  return rec.build();
}
