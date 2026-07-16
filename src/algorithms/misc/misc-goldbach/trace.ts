import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { goldbach } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const n = 100;
  rec.begin({ zh: `哥德巴赫 ${n}`, en: `Goldbach ${n}` }).commit();
  const pairs = goldbach(n, {
    onPair: (p, q) =>
      rec
        .begin({ zh: `${p}+${q}`, en: `${p}+${q}` })
        .setBars([
          { value: p, role: 'final' as BarRole },
          { value: q, role: 'final' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: `${pairs.length} 对`, en: `${pairs.length} pairs` })
    .setBars([{ value: pairs.length, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
