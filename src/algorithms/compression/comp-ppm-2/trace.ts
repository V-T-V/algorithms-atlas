import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ppmPredict } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = 'AABABCABAB'.split('').map((c) => c.charCodeAt(0));
  rec
    .begin({ zh: 'PPM', en: 'PPM' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  ppmPredict(data, 2, {
    onPredict: (ctx, s, p) =>
      rec
        .begin({
          zh: `ctx='${String.fromCharCode(ctx)}' 预测 '${String.fromCharCode(s)}' p=${p.toFixed(2)}`,
          en: '',
        })
        .setAux([{ label: 'prob', value: p.toFixed(2), role: 'final' as BarRole }])
        .commit(),
    onEscape: (ctx) =>
      rec
        .begin({ zh: `ctx='${String.fromCharCode(ctx)}' 逃逸`, en: 'escape' })
        .setAux([{ label: 'escape', value: String.fromCharCode(ctx), role: 'warn' as BarRole }])
        .commit(),
  });
  return rec.build();
}
