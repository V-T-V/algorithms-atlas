import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isKeithNumber } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const n = 197;
  rec.begin({ zh: `基思数 ${n}`, en: `Keith ${n}` }).commit();
  isKeithNumber(n, {
    onTerm: (t) =>
      rec
        .begin({ zh: `项 ${t}`, en: `term ${t}` })
        .setBars([{ value: t, role: t === n ? ('final' as BarRole) : ('pivot' as BarRole) }])
        .commit(),
  });
  return rec.build();
}
