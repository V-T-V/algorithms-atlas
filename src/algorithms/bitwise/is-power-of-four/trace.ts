// =============================================================================
// 判断 4 的幂 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isPowerOfFour, toBinary32, type IsPowerOfFourHooks } from './impl.ts';

export const DEFAULT_INPUT = 64;

export function buildTrace(n: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `判断 ${n} 是否 4 的幂`, en: `Is ${n} a power of four?` })
    .setAux([
      { label: 'n', value: String(n), role: 'pivot' },
      { label: 'n（二进制）', value: toBinary32(n), role: 'pivot' },
    ])
    .commit();

  const hooks: IsPowerOfFourHooks = {
    onCheckPositive: (_n, ok) => {
      rec
        .begin({ zh: `条件 1：n > 0 → ${ok}`, en: `Condition 1: n > 0 -> ${ok}` })
        .setAux([{ label: 'n > 0', value: String(ok), role: 'compare' }])
        .commit();
    },
    onCheckSingleBit: (_n, ok) => {
      rec
        .begin({
          zh: `条件 2：n & (n-1) == 0（唯一 1 位）→ ${ok}`,
          en: `Condition 2: n & (n-1) == 0 (single 1-bit) -> ${ok}`,
        })
        .setAux([
          { label: 'n-1（二进制）', value: toBinary32(_n - 1), role: 'frontier' },
          { label: 'single bit', value: String(ok), role: 'compare' },
        ])
        .commit();
    },
    onCheckEvenPosition: (_n, isEven) => {
      rec
        .begin({
          zh: `条件 3：n & 0x55555555 != 0（1 位在偶数位）→ ${isEven}`,
          en: `Condition 3: n & 0x55555555 != 0 (bit on even position) -> ${isEven}`,
        })
        .setAux([
          { label: 'n & mask', value: String(_n & 0x55555555), role: 'compare' },
          { label: 'even position', value: String(isEven), role: 'frontier' },
        ])
        .commit();
    },
    onResult: (result) => {
      rec
        .begin({
          zh: `结果：${result ? '是' : '不是'} 4 的幂`,
          en: `Result: ${result ? 'YES' : 'NO'}`,
        })
        .setAux([{ label: 'isPowerOfFour', value: String(result), role: 'final' }])
        .commit();
    },
  };

  isPowerOfFour(n, hooks);

  return rec.build();
}
