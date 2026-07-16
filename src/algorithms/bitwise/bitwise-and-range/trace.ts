// =============================================================================
// 区间按位与 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rangeBitwiseAnd, toBinaryString, type AndRangeHooks } from './impl.ts';

export const DEFAULT_LEFT = 5;
export const DEFAULT_RIGHT = 7;

/** 录制演示帧序列。 */
export function buildTrace(left: number = DEFAULT_LEFT, right: number = DEFAULT_RIGHT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `计算 [${left}, ${right}] 的按位与（${toBinaryString(left)} … ${toBinaryString(right)}）`,
      en: `AND over [${left}, ${right}]`,
    })
    .setAux([
      { label: 'left', value: `${left} (${toBinaryString(left)})`, role: 'pivot' },
      { label: 'right', value: `${right} (${toBinaryString(right)})`, role: 'pivot' },
    ])
    .commit();

  const hooks: AndRangeHooks = {
    onShift: (shift, l, r) => {
      rec
        .begin({
          zh: `第 ${shift} 次右移：left=${l}, right=${r}`,
          en: `Shift #${shift}: left=${l}, right=${r}`,
        })
        .setAux([
          { label: 'shift', value: String(shift), role: 'warn' },
          { label: 'left>>shift', value: toBinaryString(l), role: 'frontier' },
          { label: 'right>>shift', value: toBinaryString(r), role: 'frontier' },
        ])
        .commit();
    },
    onDone: (result) => {
      rec
        .begin({
          zh: `公共前缀左移还原 = ${result}（${toBinaryString(result)}）`,
          en: `Result = ${result} (${toBinaryString(result)})`,
        })
        .setBars([{ value: result, role: 'final' as BarRole }])
        .commit();
    },
  };

  rangeBitwiseAnd(left, right, hooks);

  return rec.build();
}
