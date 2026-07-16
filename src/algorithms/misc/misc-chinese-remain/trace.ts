import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { crt } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const rems = [2, 3, 2],
    mods = [3, 5, 7];
  rec.begin({ zh: 'CRT x≡2 mod 3, x≡3 mod 5, x≡2 mod 7', en: 'CRT' }).commit();
  const x = crt(rems, mods, {
    onConclude: (xx, N) =>
      rec
        .begin({ zh: `x=${xx} (mod ${N})`, en: `x=${xx} (mod ${N})` })
        .setBars([{ value: xx, role: 'final' as BarRole }])
        .commit(),
  });
  void x;
  return rec.build();
}
