// =============================================================================
// 分糖果（贪心）· 录制帧序列
// 可视化：setArray 渲染 candies；setAux 展示 ratings 与阶段。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { candy, type CandyGHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 0, 2];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  const candies: number[] = new Array<number>(n).fill(1);

  rec
    .begin({
      zh: `分糖果：ratings=[${input.join(', ')}]，相邻高分者糖果更多`,
      en: `Candy: ratings=[${input.join(', ')}], higher neighbor gets more`,
    })
    .setArray(
      [...candies],
      candies.map(() => 'default' as BarRole),
      [],
    )
    .setAux([{ label: 'ratings', value: `[${input.join(', ')}]`, role: 'default' }])
    .commit();

  const hooks: CandyGHooks = {
    onLeftPass: (i, c) => {
      candies.length = 0;
      candies.push(...c);
      rec
        .begin({
          zh: `左→右：i=${i}，candies=[${c.join(', ')}]`,
          en: `Left pass: i=${i}, candies=[${c.join(', ')}]`,
        })
        .setArray(
          [...candies],
          candies.map((_, k) => (k === i ? ('swap' as BarRole) : ('default' as BarRole))),
          [],
        )
        .setAux([{ label: '阶段', value: '左规则', role: 'pivot' }])
        .commit();
    },
    onRightPass: (i, c) => {
      candies.length = 0;
      candies.push(...c);
      rec
        .begin({
          zh: `右→左：i=${i}，candies=[${c.join(', ')}]`,
          en: `Right pass: i=${i}, candies=[${c.join(', ')}]`,
        })
        .setArray(
          [...candies],
          candies.map((_, k) => (k === i ? ('swap' as BarRole) : ('default' as BarRole))),
          [],
        )
        .setAux([{ label: '阶段', value: '右规则', role: 'pivot' }])
        .commit();
    },
  };

  const result = candy(input, hooks);

  rec
    .begin({ zh: `完成：最少 ${result.total} 颗`, en: `Done: min ${result.total} candies` })
    .setArray(
      [...result.candies],
      result.candies.map(() => 'final' as BarRole),
      [],
    )
    .setAux([
      { label: 'ratings', value: `[${input.join(', ')}]`, role: 'default' },
      { label: 'candies', value: `[${result.candies.join(', ')}]`, role: 'final' },
      { label: '总数', value: String(result.total), role: 'final' },
    ])
    .commit();

  return rec.build();
}
