import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { babyStepGiantStep } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'BSGS 2^x≡3 mod 5', en: 'BSGS 2^x≡3 mod 5' }).commit();
  const x = babyStepGiantStep(2, 3, 5, {
    onConclude: (xx) =>
      rec
        .begin({ zh: xx === null ? '无解' : `x=${xx}`, en: xx === null ? 'none' : `x=${xx}` })
        .setBars([{ value: xx ?? 0, role: 'final' as BarRole }])
        .commit(),
  });
  void x;
  return rec.build();
}
