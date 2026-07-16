// =============================================================================
// FFT · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { multiplyFFT, type FftHooks } from './impl.ts';

export const DEFAULT_INPUT = { a: [1, 2, 3], b: [4, 5, 6] };

export function buildTrace(input: { a: number[]; b: number[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let stages = 0;
  let result: number[] = [];

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars((result.length ? result : input.a).map((v) => ({ value: v, role: 'frontier' })))
      .setAux([
        { label: 'A', value: input.a.join(','), role: 'frontier' },
        { label: 'B', value: input.b.join(','), role: 'frontier' },
        { label: '蝶形阶段数', value: String(stages), role: 'pivot' },
      ])
      .commit();
  };

  snap({
    zh: `A=[${input.a.join(',')}] · B=[${input.b.join(',')}]`,
    en: `A=[${input.a.join(',')}] · B=[${input.b.join(',')}]`,
  });

  const hooks: FftHooks = {
    onButterfly: () => {
      stages++;
    },
    onDone: (r) => {
      result = r;
      snap({ zh: `结果=[${r.join(',')}]`, en: `Result=[${r.join(',')}]` });
    },
  };

  const ans = multiplyFFT(input.a, input.b, hooks);

  rec
    .begin({ zh: `卷积=[${ans.join(',')}]`, en: `Convolution=[${ans.join(',')}]` })
    .setBars(ans.map((v) => ({ value: v, role: 'final' })))
    .commit();

  return rec.build();
}
