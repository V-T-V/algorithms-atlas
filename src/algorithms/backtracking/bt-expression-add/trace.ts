import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { addOperators } from './impl.ts';
export const DEFAULT_INPUT = { num: '123', target: 6 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '表达式目标 ' + input.target, en: 'target ' + input.target }).commit();
  const r = addOperators(input.num, input.target, {
    onResult: (e) =>
      rec
        .begin({ zh: e, en: e })
        .setAux([{ label: 'expr', value: e, role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '共 ' + r.length + ' 个', en: r.length + ' exprs' })
    .setAux([{ label: 'count', value: String(r.length), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
