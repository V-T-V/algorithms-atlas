import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { createPipeline } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const pipe = createPipeline<number>(
    [
      { name: 'double', fn: (x) => x * 2 },
      { name: 'add10', fn: (x) => x + 10 },
      { name: 'halve', fn: (x) => Math.floor(x / 2) },
    ],
    {
      onStage: (i, name, input, output) =>
        rec
          .begin({ zh: `stage[${i}] ${name}`, en: `stage[${i}] ${name}` })
          .setAux([
            { label: 'in', value: String(input), role: 'compare' as BarRole },
            { label: 'out', value: String(output), role: 'final' as BarRole },
          ])
          .commit(),
    },
  );
  void pipe(3);
  return rec.build();
}
