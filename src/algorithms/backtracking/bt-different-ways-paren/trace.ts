import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { diffWaysToCompute } from './impl.ts';
export const DEFAULT_EXPR = '2-1-1';
export function buildTrace(expr: string = DEFAULT_EXPR): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '"' + expr + '" 求值', en: 'Compute "' + expr + '"' }).commit();
  const vals = diffWaysToCompute(expr, {
    onCombine: (l, op, r, res) =>
      rec
        .begin({ zh: l + op + r + '=' + res, en: l + op + r + '=' + res })
        .setAux([{ label: 'val', value: String(res), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '可能值：' + vals.join(','), en: 'vals: ' + vals.join(',') })
    .setBars(vals.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
