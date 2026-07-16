// =============================================================================
// 位反转 · 录制帧序列
// 逐元素展示 8 位宽下的位反转过程。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bitReversal, type BitReversalHooks } from './impl.ts';

export const DEFAULT_INPUT = [0b110, 0b10010, 0b10101010, 0b1, 0b11110000];

const pad = (n: number, bits: number): string => (n >>> 0).toString(2).padStart(bits, '0');

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const out: number[] = [];
  const BITS = 8;

  rec
    .begin({
      zh: `输入数组（${BITS} 位宽）：${input.join(', ')}`,
      en: `Input array (${BITS}-bit): ${input.join(', ')}`,
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
    const hooks: BitReversalHooks = {
      onSwap: (step, v) => {
        rec
          .begin({
            zh: `x = ${x}：第 ${step + 1} 步位块交换后 → ${v >>> 0} (${pad(v >>> 0, BITS)})`,
            en: `x = ${x}: after step ${step + 1} block swap → ${v >>> 0} (${pad(v >>> 0, BITS)})`,
          })
          .setArray([...input], roles, [{ index: idx, label: 'i' }])
          .setAux([{ label: '中间 v', value: pad(v >>> 0, BITS), role: 'frontier' }])
          .commit();
      },
    };
    const result = bitReversal(x, BITS, hooks);
    out.push(result);
    rec
      .begin({
        zh: `x = ${pad(x, BITS)} → 反转 = ${pad(result, BITS)} = ${result}`,
        en: `x = ${pad(x, BITS)} → reversed = ${pad(result, BITS)} = ${result}`,
      })
      .setArray([...input], roles, [{ index: idx, label: 'i' }])
      .setAux([
        { label: 'x (二进制)', value: pad(x, BITS), role: 'pivot' },
        { label: '反转结果', value: pad(result, BITS), role: 'final' },
      ])
      .commit();
  });

  rec
    .begin({
      zh: `完成：位反转结果为 ${out.join(', ')}`,
      en: `Done: bit-reversed = ${out.join(', ')}`,
    })
    .setArray(
      out,
      out.map(() => 'final' as BarRole),
      [],
    )
    .commit();

  return rec.build();
}
