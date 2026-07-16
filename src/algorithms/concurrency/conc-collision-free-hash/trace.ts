import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { stripedHashTable } from './impl.ts';
export const DEFAULT_INPUT: any = {
  ops: [
    { op: 'put', key: 1, val: 10 },
    { op: 'put', key: 2, val: 20 },
    { op: 'get', key: 1 },
  ],
  segments: 4,
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '分段哈希', en: 'Striped Hash' }).commit();
  const t = stripedHashTable(input.ops, input.segments, {
    onPut: (k, s) =>
      rec
        .begin({ zh: 'put ' + k + '@seg' + s, en: 'put' })
        .setAux([
          { label: 'key', value: String(k), role: 'compare' as BarRole },
          { label: 'seg', value: String(s), role: 'pivot' as BarRole },
        ])
        .commit(),
    onGet: (k, f) =>
      rec
        .begin({ zh: 'get ' + k + ' ' + (f ? '命中' : '未中'), en: 'get' })
        .setAux([{ label: 'found', value: String(f), role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: t.size + ' 项', en: t.size + ' items' })
    .setAux([{ label: 'size', value: String(t.size), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
