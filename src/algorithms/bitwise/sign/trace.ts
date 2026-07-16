// =============================================================================
// 位运算符号 · 录制帧序列
// 逐元素展示无分支符号判定。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sign, type SignHooks } from './impl.ts';

export const DEFAULT_INPUT = [-7, -1, 0, 1, 42, -2147483648];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const out: number[] = [];

  rec
    .begin({
      zh: `输入数组：${input.join(', ')}`,
      en: `Input array: ${input.join(', ')}`,
    })
    .setArray(
      [...input],
      input.map(() => 'default' as BarRole),
      [{ index: 0, label: 'i' }],
    )
    .commit();

  const hooks: SignHooks = {
    onResolve: (x, nonzero, sgn) => {
      const i = out.length;
      out.push(sgn);
      const roles: BarRole[] = input.map(() => 'default');
      roles[i] = 'pivot';
      rec
        .begin({
          zh: `x = ${x}：是否非零 = ${nonzero ? '是(-1)' : '否(0)'} → sign = ${sgn}`,
          en: `x = ${x}: nonzero = ${nonzero ? 'yes(-1)' : 'no(0)'} → sign = ${sgn}`,
        })
        .setArray([...input], roles, [{ index: i, label: 'i' }])
        .setAux([
          { label: 'x', value: String(x), role: 'pivot' },
          { label: '符号位 x>>31', value: String(x >> 31), role: 'compare' },
          { label: '是否非零', value: String(nonzero), role: 'compare' },
          { label: 'sign', value: String(sgn), role: 'final' },
        ])
        .commit();
    },
  };

  for (const x of input) sign(x, hooks);

  rec
    .begin({
      zh: `完成：符号数组为 ${out.join(', ')}`,
      en: `Done: signs = ${out.join(', ')}`,
    })
    .setArray(
      out,
      out.map(() => 'final' as BarRole),
      [],
    )
    .commit();

  return rec.build();
}
