import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hopscotchInsert } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const keys = [1, 9, 17, 25];
  rec.begin({ zh: 'Hopscotch H=4', en: 'Hopscotch H=4' }).commit();
  const ok = hopscotchInsert(32, keys, {
    onInsert: (k, s) =>
      rec
        .begin({ zh: `${k} -> slot${s}`, en: `${k} -> slot${s}` })
        .setBars([{ value: s, role: 'final' as BarRole }])
        .commit(),
    onDisplace: (k, f, t) => rec.begin({ zh: `${k}: ${f}->${t}`, en: `${k}: ${f}->${t}` }).commit(),
  });
  rec
    .begin({ zh: ok ? '成功' : '失败', en: ok ? 'OK' : 'fail' })
    .setAux([
      {
        label: 'ok',
        value: ok ? 'YES' : 'NO',
        role: ok ? ('final' as BarRole) : ('warn' as BarRole),
      },
    ])
    .commit();
  return rec.build();
}
