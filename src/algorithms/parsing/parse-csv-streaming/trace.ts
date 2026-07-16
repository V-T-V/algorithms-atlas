import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { StreamingCsv } from './impl.ts';

export const DEFAULT_INPUT = 'a,b\nc,"x,y"\nz';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `输入: ${JSON.stringify(input)}`, en: `Input: ${JSON.stringify(input)}` })
    .commit();
  const parser = new StreamingCsv(',', {
    onRow: (r) =>
      rec
        .begin({ zh: `行: ${JSON.stringify(r)}`, en: `Row: ${JSON.stringify(r)}` })
        .setAux(r.map((f, i) => ({ label: `f${i}`, value: f, role: 'final' as BarRole })))
        .commit(),
  });
  parser.feed(input);
  parser.end();
  return rec.build();
}
