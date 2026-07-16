import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { expand } from './impl.ts';
export const DEFAULT_S = '{a,b}c{d,e}';
export function buildTrace(s: string = DEFAULT_S): Frame[] {
  const rec = new TraceRecorder();
  const cur: string[] = [];
  rec.begin({ zh: '展开 "' + s + '"', en: 'Expand "' + s + '"' }).commit();
  expand(s, {
    onPick: (ch) => {
      cur.push(ch);
      rec
        .begin({ zh: '选 ' + ch, en: 'pick ' + ch })
        .setAux([{ label: 'cur', value: cur.join(''), role: 'pivot' as BarRole }])
        .commit();
    },
    onResult: (w) =>
      rec
        .begin({ zh: w, en: w })
        .setBars([{ value: w.length, role: 'final' as BarRole, label: w }])
        .commit(),
  });
  rec.begin({ zh: '完成', en: 'Done' }).commit();
  return rec.build();
}
