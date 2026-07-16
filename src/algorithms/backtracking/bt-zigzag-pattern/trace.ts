import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { convert } from './impl.ts';
export const DEFAULT_INPUT = { s: 'PAYPALISHIRING', numRows: 3 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '之字形行=' + input.numRows, en: 'Zigzag rows=' + input.numRows }).commit();
  const r = convert(input.s, input.numRows, {
    onPlace: (ch, row) =>
      rec
        .begin({ zh: ch + ' 入行 ' + row, en: ch + ' row ' + row })
        .setAux([{ label: 'row', value: String(row), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '结果 = ' + r, en: 'Result = ' + r })
    .setBars([{ value: r.length, role: 'final' as BarRole, label: r }])
    .commit();
  return rec.build();
}
