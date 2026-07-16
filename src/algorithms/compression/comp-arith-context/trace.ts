import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { caacEncode } from './impl.ts';
export const DEFAULT_INPUT = { bits: [0, 0, 1, 0, 1, 1, 0, 1], ctxBits: 2 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'CABAC 上下文=' + input.ctxBits, en: 'CABAC ctx=' + input.ctxBits }).commit();
  const { low, tables } = caacEncode(input.bits, input.ctxBits, {
    onSymbol: (ctx, b, p0) =>
      rec
        .begin({ zh: 'ctx' + ctx + ' b=' + b + ' p0=' + p0.toFixed(2), en: 'sym' })
        .setAux([
          { label: 'ctx', value: String(ctx), role: 'pivot' as BarRole },
          { label: 'p0', value: p0.toFixed(2), role: 'compare' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: 'low=' + low.toPrecision(4) + ' 上下文' + tables.size, en: 'result' })
    .setAux([
      { label: 'low', value: low.toPrecision(4), role: 'final' as BarRole },
      { label: 'ctx', value: String(tables.size), role: 'final' as BarRole },
    ])
    .commit();
  return rec.build();
}
