// =============================================================================
// 石子游戏 II · 录制帧序列
// 可视化：setArray 渲染 piles（高亮当前 i）；setAux 展示 (i,M) 子问题。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { stoneGame2, type StoneGame2Hooks } from './impl.ts';

export const DEFAULT_INPUT = [2, 7, 9, 4, 4];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;

  rec
    .begin({
      zh: `石子游戏 II：piles=[${input.join(', ')}]，初始 M=1，可取 1..2M 堆`,
      en: `Stone Game II: piles=[${input.join(', ')}], M=1, take 1..2M piles`,
    })
    .setArray(
      [...input],
      input.map(() => 'default' as BarRole),
      [],
    )
    .setAux([
      { label: 'piles', value: `[${input.join(', ')}]`, role: 'default' },
      { label: '初始 M', value: '1', role: 'pivot' },
    ])
    .commit();

  const hooks: StoneGame2Hooks = {
    onSolve: (i, m, advantage) => {
      const pointers: Array<{ index: number; label: string }> = [];
      if (i < n) pointers.push({ index: i, label: `i=${i}` });
      rec
        .begin({
          zh: `子问题 (i=${i}, M=${m})：当前玩家优势 = ${advantage}`,
          en: `Subproblem (i=${i}, M=${m}): advantage = ${advantage}`,
        })
        .setArray(
          [...input],
          input.map((_, k) => (k >= i ? ('compare' as BarRole) : ('sorted' as BarRole))),
          pointers,
        )
        .setAux([
          { label: 'i', value: String(i), role: 'pivot' },
          { label: 'M', value: String(m), role: 'pivot' },
          { label: '优势 advantage', value: String(advantage), role: 'final' },
        ])
        .commit();
    },
  };

  const result = stoneGame2(input, hooks);

  rec
    .begin({
      zh: `完成：Alice 最多拿 ${result.aliceStones} 颗（总 ${result.total}，优势 ${result.advantage}）`,
      en: `Done: Alice max = ${result.aliceStones} (total ${result.total}, advantage ${result.advantage})`,
    })
    .setArray(
      [...input],
      input.map(() => 'final' as BarRole),
      [],
    )
    .setAux([
      { label: 'Alice 石子数', value: String(result.aliceStones), role: 'final' },
      { label: '总石子数', value: String(result.total), role: 'default' },
      { label: '先手优势', value: String(result.advantage), role: 'final' },
    ])
    .commit();

  return rec.build();
}
