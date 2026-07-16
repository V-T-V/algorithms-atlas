// =============================================================================
// NTT · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { multiplyNTT, type NttHooks } from './impl.ts';

export const DEFAULT_INPUT = { a: [1, 2, 3], b: [4, 5, 6] };

export function buildTrace(input: { a: number[]; b: number[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let butterflyCount = 0;
  let result: bigint[] = [];

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(
        (result.length ? result : input.a.map(BigInt)).map((v) => ({
          value: Number(v),
          role: 'frontier',
        })),
      )
      .setAux([
        { label: 'A', value: input.a.join(','), role: 'frontier' },
        { label: 'B', value: input.b.join(','), role: 'frontier' },
        { label: '蝶形', value: String(butterflyCount), role: 'pivot' },
      ])
      .commit();
  };

  snap({
    zh: `A=[${input.a.join(',')}] · B=[${input.b.join(',')}]`,
    en: `A=[${input.a.join(',')}] · B=[${input.b.join(',')}]`,
  });

  const hooks: NttHooks = {
    onButterfly: () => {
      butterflyCount++;
    },
    onDone: (r) => {
      result = r;
      snap({ zh: `结果=[${r.join(',')}]`, en: `Result=[${r.join(',')}]` });
    },
  };

  const ans = multiplyNTT(input.a, input.b, hooks);

  rec
    .begin({ zh: `卷积=[${ans.join(',')}]`, en: `Convolution=[${ans.join(',')}]` })
    .setBars(ans.map((v) => ({ value: Number(v), role: 'final' })))
    .commit();

  return rec.build();
}
