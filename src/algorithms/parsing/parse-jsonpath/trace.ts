import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { parsePath, queryPath } from './impl.ts';

export const DEFAULT_INPUT = {
  data: { store: { book: [{ title: 'A' }, { title: 'B' }] } },
  path: '$.store.book[*].title',
};

export function buildTrace(input: { data: unknown; path: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const segs = parsePath(input.path);
  rec
    .begin({ zh: `路径: ${input.path}`, en: `Path: ${input.path}` })
    .setAux(
      segs.map((s, i) => ({
        label: `s${i}`,
        value: s.kind + (s.value !== undefined ? `:${s.value}` : ''),
        role: 'compare' as BarRole,
      })),
    )
    .commit();
  const res = queryPath(input.data, input.path);
  rec
    .begin({ zh: `结果: ${JSON.stringify(res)}`, en: `Result: ${JSON.stringify(res)}` })
    .setAux(
      res.map((v, i) => ({ label: `r${i}`, value: JSON.stringify(v), role: 'final' as BarRole })),
    )
    .commit();
  return rec.build();
}
