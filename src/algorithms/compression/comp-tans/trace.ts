import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { tansBuildTable, tansEncode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = 'AABBA'.split('').map((c) => c.charCodeAt(0));
  const syms = [65, 66];
  const table = tansBuildTable(syms, 8);
  rec
    .begin({ zh: 'tANS', en: 'tANS' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  tansEncode(data, table, 8, {
    onTable: (t) =>
      rec
        .begin({ zh: `表 ${t.length} 项`, en: `table ${t.length} entries` })
        .setAux([{ label: 'L', value: String(t.length), role: 'compare' as BarRole }])
        .commit(),
    onEncode: (s, st) =>
      rec
        .begin({ zh: `'${String.fromCharCode(s)}' → state=${st}`, en: '' })
        .setAux([{ label: 'state', value: String(st), role: 'final' as BarRole }])
        .commit(),
  });
  return rec.build();
}
