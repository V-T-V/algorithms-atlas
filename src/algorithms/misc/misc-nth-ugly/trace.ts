// =============================================================================
// 第 N 个丑数 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { nthUglyNumber, type NthUglyHooks } from './impl.ts';

export const DEFAULT_INPUT = 10;

export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const generated: Array<{ index: number; value: number; source: number }> = [];

  rec
    .begin({ zh: `求第 ${input} 个丑数`, en: `Find ugly #${input}` })
    .setAux([{ label: 'n', value: String(input), role: 'pivot' as BarRole }])
    .commit();

  const hooks: NthUglyHooks = {
    onGenerate: (index, value, source) => generated.push({ index, value, source }),
  };

  const result = nthUglyNumber(input, hooks);

  for (const g of generated) {
    rec
      .begin({
        zh: `ugly[${g.index}] = ${g.value}（来自 ×${g.source}）`,
        en: `ugly[${g.index}] = ${g.value} (via ×${g.source})`,
      })
      .setAux([
        { label: '下标', value: String(g.index), role: 'compare' as BarRole },
        { label: '值', value: String(g.value), role: 'final' as BarRole },
        { label: '来源', value: `×${g.source}`, role: 'pivot' as BarRole },
      ])
      .commit();
  }

  rec
    .begin({ zh: `第 ${input} 个丑数 = ${result}`, en: `Ugly #${input} = ${result}` })
    .setAux([{ label: '答案', value: String(result), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
