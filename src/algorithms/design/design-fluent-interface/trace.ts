import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Counter } from './impl.ts';
export const DEFAULT_INPUT: any = null;
export function buildTrace(_input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '流式', en: 'Fluent' }).commit();
  const c = new Counter();
  c.add(5)
    .sub(2)
    .mul(3)
    .add(1, {
      onOp: (op, v) =>
        rec
          .begin({ zh: op + ' ' + v, en: 'op' })
          .setAux([
            { label: 'op', value: op, role: 'compare' as BarRole },
            { label: 'val', value: String(v), role: 'pivot' as BarRole },
          ])
          .commit(),
    });
  rec
    .begin({ zh: '结果 ' + c.value(), en: 'value' })
    .setAux([{ label: 'value', value: String(c.value()), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
