import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { geneticAlgorithm } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: 'GA OneMax n=8', en: 'GA OneMax n=8' })
    .setBars(Array.from({ length: 8 }, () => ({ value: 0, role: 'default' as BarRole })))
    .commit();
  geneticAlgorithm(8, 12, 20, 0.05, 7, {
    onGeneration: (g, best, avg) => {
      rec
        .begin({
          zh: `第 ${g} 代 best=${best} avg=${avg.toFixed(1)}`,
          en: `gen ${g} best=${best} avg=${avg.toFixed(1)}`,
        })
        .setBars(
          Array.from({ length: 8 }, (_, i) => ({
            value: i < best ? 1 : 0,
            role: (i < best ? 'final' : 'default') as BarRole,
            label: String(i),
          })),
        )
        .setAux([{ label: 'best', value: String(best), role: 'swap' as BarRole }])
        .commit();
    },
    onDone: (best, fit) =>
      rec
        .begin({ zh: `完成 fit=${fit}`, en: `done fit=${fit}` })
        .setBars(best.map((b) => ({ value: b, role: 'final' as BarRole })))
        .commit(),
  });
  return rec.build();
}
