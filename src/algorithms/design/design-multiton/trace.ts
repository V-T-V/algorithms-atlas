import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Multiton } from './impl.ts';
export const DEFAULT_INPUT: any = ['a', 'b', 'a', 'c', 'a'];
export function buildTrace(input: string[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '多例', en: 'Multiton' }).commit();
  const m = new Multiton();
  for (const k of input) {
    const it = m.get(k, {
      onAccess: (key, created) =>
        rec
          .begin({ zh: key + (created ? ' 新建' : ' 复用'), en: 'access' })
          .setAux([
            { label: 'key', value: key, role: 'compare' as BarRole },
            {
              label: 'created',
              value: String(created),
              role: created ? ('final' as BarRole) : ('warn' as BarRole),
            },
          ])
          .commit(),
    });
    void it;
  }
  rec
    .begin({ zh: '共 ' + m.size() + ' 实例', en: m.size() + ' instances' })
    .setAux([{ label: 'size', value: String(m.size()), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
