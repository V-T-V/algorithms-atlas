import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { josephusVariant } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '约瑟夫 n=41 k=3', en: 'Josephus n=41 k=3' }).commit();
  const s = josephusVariant(41, 3, {
    onConclude: (sv) =>
      rec
        .begin({ zh: `幸存者位置 ${sv}`, en: `survivor ${sv}` })
        .setBars([{ value: sv, role: 'final' as BarRole }])
        .commit(),
  });
  void s;
  return rec.build();
}
