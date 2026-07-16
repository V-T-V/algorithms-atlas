// =============================================================================
// 格雷码转二进制 · 录制帧序列
// 逐元素展示 g ^ (g>>1) ^ (g>>2) … 的累积异或过程。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { grayToBinary, type GrayToBinaryHooks } from './impl.ts';

export const DEFAULT_INPUT = [0b1110, 0b1000, 0b1010, 0b1, 0b110, 0b100];

const bin = (n: number): string => (n >>> 0).toString(2).padStart(4, '0');

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const out: number[] = [];

  rec
    .begin({
      zh: `输入格雷码数组：${input.join(', ')}`,
      en: `Input Gray codes: ${input.join(', ')}`,
    })
    .setArray(
      [...input],
      input.map(() => 'default' as BarRole),
      [{ index: 0, label: 'i' }],
    )
    .commit();

  input.forEach((g, idx) => {
    const roles: BarRole[] = input.map(() => 'default');
    roles[idx] = 'pivot';
    const hooks: GrayToBinaryHooks = {
      onXor: (step, mask, b) => {
        rec
          .begin({
            zh: `g = ${g}：第 ${step + 1} 次异或 mask = g >> ${step + 1}（${bin(mask)}）→ b = ${bin(b)}`,
            en: `g = ${g}: XOR #${step + 1} mask = g >> ${step + 1} (${bin(mask)}) → b = ${bin(b)}`,
          })
          .setArray([...input], roles, [{ index: idx, label: 'i' }])
          .setAux([
            { label: 'mask', value: bin(mask), role: 'compare' },
            { label: '累积 b', value: bin(b), role: 'frontier' },
          ])
          .commit();
      },
    };
    const result = grayToBinary(g, hooks);
    out.push(result);
    rec
      .begin({
        zh: `Gray ${bin(g)} (${g}) → Binary ${bin(result)} (${result})`,
        en: `Gray ${bin(g)} (${g}) → Binary ${bin(result)} (${result})`,
      })
      .setArray([...input], roles, [{ index: idx, label: 'i' }])
      .setAux([
        { label: 'Gray', value: bin(g), role: 'pivot' },
        { label: 'Binary', value: bin(result), role: 'final' },
      ])
      .commit();
  });

  rec
    .begin({
      zh: `完成：二进制数组为 ${out.join(', ')}`,
      en: `Done: binaries = ${out.join(', ')}`,
    })
    .setArray(
      out,
      out.map(() => 'final' as BarRole),
      [],
    )
    .commit();

  return rec.build();
}
