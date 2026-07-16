// =============================================================================
// 阶乘尾零 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { trailingZeroes, type TrailingZeroHooks } from './impl.ts';

export const DEFAULT_INPUT = 100;

export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const terms: Array<{ divisor: number; term: number; acc: number }> = [];

  rec
    .begin({ zh: `求 ${input}! 的尾零数`, en: `Trailing zeros of ${input}!` })
    .setAux([{ label: 'n', value: String(input), role: 'pivot' as BarRole }])
    .commit();

  const hooks: TrailingZeroHooks = {
    onTerm: (divisor, term, acc) => terms.push({ divisor, term, acc }),
  };

  const result = trailingZeroes(input, hooks);

  for (const t of terms) {
    rec
      .begin({
        zh: `项 n/${t.divisor} = ${t.term}，累计 ${t.acc}`,
        en: `Term n/${t.divisor} = ${t.term}, acc ${t.acc}`,
      })
      .setAux([
        { label: '除数', value: String(t.divisor), role: 'compare' as BarRole },
        { label: '该项', value: String(t.term), role: 'pivot' as BarRole },
        { label: '累计', value: String(t.acc), role: 'final' as BarRole },
      ])
      .commit();
  }

  rec
    .begin({ zh: `${input}! 有 ${result} 个尾零`, en: `${input}! has ${result} trailing zeros` })
    .setAux([{ label: '答案', value: String(result), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
