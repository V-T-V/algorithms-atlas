import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { evaluate, num, varr, addE, mulE } from './impl.ts';
export const DEFAULT_INPUT: any = { x: 3, y: 4 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '解释 (x+y)*x', en: 'interp' }).commit();
  const ctx = new Map([
    ['x', input.x],
    ['y', input.y],
  ]);
  const ast = mulE(addE(varr('x'), varr('y')), varr('x'));
  const v = evaluate(ast, ctx, {
    onEval: (d, val) =>
      rec
        .begin({ zh: '深度 ' + d + ' = ' + val, en: 'eval' })
        .setAux([{ label: 'depth', value: String(d), role: 'compare' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '结果 ' + v, en: 'result' })
    .setAux([{ label: 'result', value: String(v), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
