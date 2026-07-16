import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Subject, queryExt } from './impl.ts';
export const DEFAULT_INPUT: any = ['a', 'b', 'c'];
export function buildTrace(input: string[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '扩展对象', en: 'Extension Object' }).commit();
  const s = new Subject();
  s.setExtension('a', { id: 'a' });
  for (const id of input)
    queryExt(s, id, {
      onQuery: (i, f) =>
        rec
          .begin({ zh: '查询 ' + i + ' ' + (f ? '命中' : '缺失'), en: 'query' })
          .setAux([
            { label: 'id', value: i, role: 'compare' as BarRole },
            {
              label: 'found',
              value: String(f),
              role: f ? ('final' as BarRole) : ('warn' as BarRole),
            },
          ])
          .commit(),
    });
  rec
    .begin({ zh: '完成', en: 'done' })
    .setAux([{ label: 'done', value: 'ok', role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
