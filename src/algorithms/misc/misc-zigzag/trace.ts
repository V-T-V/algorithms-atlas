// Z 字形变换 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscZigzag } from './impl.ts';
export const DEFAULT_INPUT = { s: 'PAYPALISHIRING', numRows: 3 };
export function buildTrace(input: { s?: string; numRows?: number } = {}): Frame[] {
  const { s = DEFAULT_INPUT.s, numRows = DEFAULT_INPUT.numRows } = input;
  const rec = new TraceRecorder();
  rec.begin({ zh: `zigzag "${s}" r=${numRows}`, en: `zigzag "${s}" r=${numRows}` }).commit();
  const r = miscZigzag(s, numRows, {
    onRow: (row, ch) =>
      rec.begin({ zh: `写入行 ${row}: '${ch}'`, en: `Row ${row}: '${ch}'` }).commit(),
  });
  rec
    .begin({ zh: `结果 ${r}`, en: `Result ${r}` })
    .setAux([{ label: '答案', value: r, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
