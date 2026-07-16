import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { millerRabin } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const n = 561;
  rec.begin({ zh: `Miller-Rabin ${n}`, en: `Miller-Rabin ${n}` }).commit();
  const p = millerRabin(n, 10, {
    onConclude: (pp) =>
      rec
        .begin({ zh: `${n} ${pp ? '可能素' : '合数'}`, en: `${n} ${pp ? 'prime?' : 'composite'}` })
        .setBars([{ value: pp ? 1 : 0, role: pp ? ('final' as BarRole) : ('warn' as BarRole) }])
        .commit(),
  });
  void p;
  return rec.build();
}
