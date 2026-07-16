// =============================================================================
// 元音拼写计数 · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { countVowelPermutation, type VowelHooks } from './impl.ts';

export const DEFAULT_INPUT = 5;

export function buildTrace(n: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let total = 5;

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars([{ value: total, role: 'frontier' }])
      .setAux([{ label: '总方案数', value: String(total), role: 'pivot' }])
      .commit();
  };

  snap({ zh: `n=${n}`, en: `n=${n}` });

  const hooks: VowelHooks = {
    onDay: (i, t) => {
      total = t;
      snap({ zh: `len=${i} 总=${t}`, en: `len=${i} total=${t}` });
    },
  };

  const ans = countVowelPermutation(n, hooks);

  rec
    .begin({ zh: `答案=${ans}`, en: `ans=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
