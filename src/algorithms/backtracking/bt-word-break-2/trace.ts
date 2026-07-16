import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { wordBreak } from './impl.ts';
export const DEFAULT_INPUT = { s: 'catsanddog', dict: ['cat', 'cats', 'and', 'sand', 'dog'] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const cur: string[] = [];
  rec.begin({ zh: '拆 "' + input.s + '"', en: 'Break "' + input.s + '"' }).commit();
  wordBreak(input.s, input.dict, {
    onCut: (w) => {
      cur.push(w);
      rec
        .begin({ zh: '切 "' + w + '"', en: 'cut "' + w + '"' })
        .setAux([{ label: 'cur', value: cur.join(' '), role: 'pivot' as BarRole }])
        .commit();
    },
    onResult: (s2) =>
      rec
        .begin({ zh: s2, en: s2 })
        .setBars([{ value: s2.length, role: 'final' as BarRole, label: s2 }])
        .commit(),
  });
  rec.begin({ zh: '完成', en: 'Done' }).commit();
  return rec.build();
}
