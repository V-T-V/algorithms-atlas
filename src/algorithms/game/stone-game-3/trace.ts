// =============================================================================
// 石子游戏 III · 录制帧序列
// 可视化：setArray 渲染 piles；setAux 展示 dp[i] 与结论。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { stoneGame3, type StoneGame3Hooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 3, 7];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  const dp: number[] = new Array<number>(n + 1).fill(0);

  rec
    .begin({
      zh: `石子游戏 III：piles=[${input.join(', ')}]，每回合取 1..3 堆`,
      en: `Stone Game III: piles=[${input.join(', ')}], take 1..3 piles per turn`,
    })
    .setArray(
      [...input],
      input.map(() => 'default' as BarRole),
      [],
    )
    .setAux([
      { label: 'piles', value: `[${input.join(', ')}]`, role: 'default' },
      { label: '规则', value: 'f(i)=max(sum(i..i+x-1)-f(i+x)), x=1..3', role: 'pivot' },
    ])
    .commit();

  const hooks: StoneGame3Hooks = {
    onSolve: (i, advantage) => {
      dp[i] = advantage;
      const pointers = [{ index: i, label: `i=${i}` }];
      rec
        .begin({
          zh: `f(${i}) = ${advantage}（当前玩家从第 ${i} 堆起的优势）`,
          en: `f(${i}) = ${advantage} (advantage from pile ${i})`,
        })
        .setArray(
          [...input],
          input.map((_, k) => (k >= i ? ('compare' as BarRole) : ('sorted' as BarRole))),
          pointers,
        )
        .setAux([
          { label: 'i', value: String(i), role: 'pivot' },
          { label: 'f(i)', value: String(advantage), role: 'final' },
        ])
        .commit();
    },
  };

  const result = stoneGame3(input, hooks);

  rec
    .begin({
      zh: `完成：${result.winner === 'Alice' ? 'Alice 赢' : result.winner === 'Bob' ? 'Bob 赢' : '平局'}（优势 ${result.advantage}）`,
      en: `Done: ${result.winner === 'Alice' ? 'Alice' : result.winner === 'Bob' ? 'Bob' : 'Tie'} (advantage ${result.advantage})`,
    })
    .setArray(
      [...input],
      input.map(() => 'final' as BarRole),
      [],
    )
    .setAux([
      {
        label: '结论',
        value: result.winner,
        role:
          result.winner === 'Alice'
            ? 'final'
            : result.winner === 'Bob'
              ? 'warn'
              : ('pivot' as BarRole),
      },
      { label: '先手优势', value: String(result.advantage), role: 'compare' },
    ])
    .commit();

  return rec.build();
}
