import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { decodeString } from './impl.ts';
export const DEFAULT_S = '3[a2[c]]';
export function buildTrace(s: string = DEFAULT_S): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '解码 "' + s + '"', en: 'Decode "' + s + '"' }).commit();
  const r = decodeString(s, {
    onBlock: (repeat, inner) =>
      rec
        .begin({ zh: repeat + '×"' + inner + '"', en: repeat + 'x"' + inner + '"' })
        .setBars([{ value: repeat, role: 'pivot' as BarRole, label: inner }])
        .commit(),
  });
  rec
    .begin({ zh: '结果 = ' + r, en: 'Result = ' + r })
    .setBars([{ value: r.length, role: 'final' as BarRole, label: r }])
    .commit();
  return rec.build();
}
