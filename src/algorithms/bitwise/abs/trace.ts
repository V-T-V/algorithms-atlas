// =============================================================================
// 位运算绝对值 · 录制帧序列
// 演示对一个示例数组逐元素求位运算绝对值；setArray 展示掩码与中间结果。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { abs, type AbsHooks } from './impl.ts';

export const DEFAULT_INPUT = [-5, 3, -8, 0, -1, 7, -2147483648, 12];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const out: number[] = [];

  rec
    .begin({
      zh: `初始数组：${input.join(', ')}`,
      en: `Initial array: ${input.join(', ')}`,
    })
    .setArray(
      [...input],
      input.map(() => 'default' as BarRole),
      [{ index: 0, label: 'i' }],
    )
    .commit();

  const snapshot = (
    i: number,
    x: number,
    mask: number,
    xored: number,
    result: number,
    note: { zh: string; en: string },
  ): void => {
    const roles: BarRole[] = input.map(() => 'default');
    roles[i] = 'pivot';
    rec
      .begin(note)
      .setArray([...input], roles, [{ index: i, label: 'i' }])
      .setAux([
        { label: 'x', value: String(x), role: 'pivot' },
        { label: 'mask = x>>31', value: String(mask), role: 'compare' },
        { label: 'x ^ mask', value: String(xored), role: 'compare' },
        { label: '|x|', value: String(result), role: 'frontier' },
      ])
      .commit();
  };

  const hooks: AbsHooks = {
    onSign: (x, mask) => {
      const i = out.length; // 当前处理下标
      snapshot(i, x, mask, x, x, {
        zh: `x = ${x} → mask = x >> 31 = ${mask}（${mask === 0 ? '非负' : '负数，全 1'}）`,
        en: `x = ${x} → mask = x >> 31 = ${mask} (${mask === 0 ? 'non-negative' : 'negative, all ones'})`,
      });
    },
    onResult: (xored, result) => {
      const i = out.length;
      out.push(result);
      snapshot(i, input[i]!, input[i]! >> 31, xored, result, {
        zh: `x ^ mask = ${xored}，再减 mask 得 |x| = ${result}`,
        en: `x ^ mask = ${xored}; subtracting mask gives |x| = ${result}`,
      });
    },
  };

  for (const x of input) abs(x, hooks);

  // 终态
  rec
    .begin({
      zh: `完成：绝对值数组为 ${out.join(', ')}`,
      en: `Done: absolute values = ${out.join(', ')}`,
    })
    .setArray(
      out,
      out.map(() => 'final' as BarRole),
      [],
    )
    .commit();

  return rec.build();
}
