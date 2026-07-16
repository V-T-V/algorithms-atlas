// =============================================================================
// 最大异或值 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findMaximumXOR, type MaxXorHooks } from './impl.ts';

export const DEFAULT_INPUT = [3, 10, 5, 25, 2, 8]; // 最大异或 28 (5 ^ 25)

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `数组 [${input.join(', ')}]，求两元素最大异或`,
      en: `nums [${input.join(', ')}], find max XOR`,
    })
    .setBars(input.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();

  const hooks: MaxXorHooks = {
    onBit: (bit, candidate, ok) => {
      rec
        .begin({
          zh: `位 ${bit}：尝试置 1（candidate=${candidate}）${ok ? '✓ 可达' : '✗ 不可达'}`,
          en: `Bit ${bit}: candidate=${candidate} ${ok ? '✓' : '✗'}`,
        })
        .setAux([{ label: `位 ${bit}`, value: ok ? '置 1' : '置 0', role: ok ? 'final' : 'warn' }])
        .commit();
    },
    onDone: (maxXor) => {
      rec
        .begin({ zh: `最大异或 = ${maxXor}`, en: `Max XOR = ${maxXor}` })
        .setBars([{ value: maxXor, role: 'final' as BarRole }])
        .commit();
    },
  };

  findMaximumXOR(input, hooks);

  return rec.build();
}
