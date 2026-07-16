// =============================================================================
// 奇偶校验 · 录制帧序列
// 逐元素展示「折半异或」折叠过程，给出最终奇偶位。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { parity, type ParityHooks } from './impl.ts';

export const DEFAULT_INPUT = [7, 12, 255, 256, 1023, 8, 1];

const bin = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);

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

  input.forEach((x, idx) => {
    const roles: BarRole[] = input.map(() => 'default');
    roles[idx] = 'pivot';
    const shifts = [16, 8, 4, 2, 1];
    const hooks: ParityHooks = {
      onFold: (step, v) => {
        rec
          .begin({
            zh: `x = ${x}：v ^= v >>> ${shifts[step]} → ${v >>> 0} (${bin(v)})`,
            en: `x = ${x}: v ^= v >>> ${shifts[step]} → ${v >>> 0} (${bin(v)})`,
          })
          .setArray([...input], roles, [{ index: idx, label: 'i' }])
          .setAux([{ label: `折半后 v (>>${shifts[step]})`, value: bin(v), role: 'frontier' }])
          .commit();
      },
    };
    const result = parity(x, hooks);
    out.push(result);
    rec
      .begin({
        zh: `x = ${x} (${bin(x)}) → 1 的个数 ${result ? '奇' : '偶'} → 校验位 = ${result}`,
        en: `x = ${x} (${bin(x)}) → popcount ${result ? 'odd' : 'even'} → parity = ${result}`,
      })
      .setArray([...input], roles, [{ index: idx, label: 'i' }])
      .setAux([
        { label: 'x', value: bin(x), role: 'pivot' },
        { label: '奇偶校验位', value: String(result), role: 'final' },
      ])
      .commit();
  });

  rec
    .begin({
      zh: `完成：奇偶校验位数组为 ${out.join(', ')}`,
      en: `Done: parities = ${out.join(', ')}`,
    })
    .setArray(
      out,
      out.map(() => 'final' as BarRole),
      [],
    )
    .commit();

  return rec.build();
}
