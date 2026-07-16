import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { brotliContextModel } from './impl.ts';
export const DEFAULT_INPUT = [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Brotli 上下文', en: 'Brotli context' }).commit();
  const tables = brotliContextModel(input, {
    onByte: (ctx, b) =>
      rec
        .begin({ zh: 'ctx=' + ctx + ' b=' + b, en: 'byte' })
        .setAux([
          { label: 'ctx', value: String(ctx), role: 'pivot' as BarRole },
          { label: 'b', value: String(b), role: 'compare' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: tables.size + ' 个上下文', en: 'ctx' })
    .setAux([{ label: 'ctx', value: String(tables.size), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
