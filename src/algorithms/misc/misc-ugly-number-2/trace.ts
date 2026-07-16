// =============================================================================
// 丑数判定 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isUglyNumber, type UglyCheckHooks } from './impl.ts';

export const DEFAULT_INPUT = 36;

export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const divides: Array<{ factor: number; quotient: number }> = [];

  rec
    .begin({ zh: `判定 ${input} 是否丑数`, en: `Is ${input} ugly?` })
    .setAux([{ label: 'n', value: String(input), role: 'pivot' as BarRole }])
    .commit();

  const hooks: UglyCheckHooks = {
    onDivide: (factor, quotient) => divides.push({ factor, quotient }),
  };

  const result = isUglyNumber(input, hooks);

  for (const d of divides) {
    rec
      .begin({
        zh: `除以 ${d.factor} → ${d.quotient}`,
        en: `Divide by ${d.factor} → ${d.quotient}`,
      })
      .setAux([
        { label: '因子', value: String(d.factor), role: 'compare' as BarRole },
        { label: '商', value: String(d.quotient), role: 'final' as BarRole },
      ])
      .commit();
  }

  rec
    .begin({
      zh: `${input} ${result ? '是' : '不是'}丑数`,
      en: `${input} is ${result ? 'ugly' : 'not ugly'}`,
    })
    .setAux([{ label: '答案', value: result ? '是' : '否', role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
