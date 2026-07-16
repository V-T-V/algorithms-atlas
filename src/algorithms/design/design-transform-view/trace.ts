import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { transformRows } from './impl.ts';
const TFN = (r: { name: string; age: number }) =>
  '<tr><td>' + r.name + '</td><td>' + r.age + '</td></tr>';
export const DEFAULT_INPUT: any = [
  { name: 'Ann', age: 30 },
  { name: 'Bob', age: 25 },
];
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '转换视图', en: 'Transform View' }).commit();
  const html = transformRows(input, TFN, {
    onRow: (i, h) =>
      rec
        .begin({ zh: '行 ' + i, en: 'row' })
        .setAux([{ label: 'row', value: String(i), role: 'compare' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: html.length + ' 字符', en: 'chars' })
    .setAux([{ label: 'chars', value: String(html.length), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
