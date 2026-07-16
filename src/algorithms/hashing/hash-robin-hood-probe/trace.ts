import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { robinHoodInsert } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const keys = [5, 21, 37, 6, 22];
  rec.begin({ zh: 'Robin Hood 探查', en: 'Robin Hood probing' }).commit();
  const mx = robinHoodInsert(8, keys, {
    onInsert: (k, p) =>
      rec
        .begin({ zh: `${k} psl=${p}`, en: `${k} psl=${p}` })
        .setBars([{ value: p, role: 'final' as BarRole }])
        .commit(),
    onSwap: (r, p) =>
      rec
        .begin({ zh: `交换 富${r} 穷${p}`, en: `swap rich${r} poor${p}` })
        .setBars([{ value: 1, role: 'warn' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: `最大 PSL ${mx}`, en: `max PSL ${mx}` })
    .setAux([{ label: 'maxPSL', value: String(mx), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
