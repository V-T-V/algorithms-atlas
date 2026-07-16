import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Monostate } from './impl.ts';
export const DEFAULT_INPUT: any = [
  [1, 10],
  [2, 20],
  [1, 99],
];
export function buildTrace(input: number[][] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '单态', en: 'Monostate' }).commit();
  const a = new Monostate(1);
  const b = new Monostate(2);
  for (const [id, v] of input) {
    (id === 1 ? a : b).set(v!, {
      onSet: (iid, val) =>
        rec
          .begin({ zh: 'inst ' + iid + ' set ' + val, en: 'set' })
          .setAux([{ label: 'inst', value: String(iid), role: 'compare' as BarRole }])
          .commit(),
    });
  }
  rec
    .begin({ zh: '共享值 ' + a.get(), en: 'shared' })
    .setAux([{ label: 'shared', value: String(a.get()), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
