import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { optimizeQuantum, type Job } from './impl.ts';
export const DEFAULT_INPUT: Job[] = [
  { id: 'A', arrival: 0, burst: 5 },
  { id: 'B', arrival: 0, burst: 3 },
  { id: 'C', arrival: 0, burst: 1 },
];
export function buildTrace(input: Job[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '量子优化', en: 'Quantum optimize' }).commit();
  const best = optimizeQuantum(input, {
    onTry: (q, aw) =>
      rec
        .begin({ zh: 'q=' + q + ' avgW=' + aw.toFixed(2), en: 'q=' + q + ' aw=' + aw.toFixed(2) })
        .setBars([{ value: aw, role: 'pivot' as BarRole, label: 'q' + q }])
        .commit(),
  });
  rec
    .begin({ zh: '最佳 q=' + best.quantum, en: 'best q=' + best.quantum })
    .setAux([{ label: 'quantum', value: String(best.quantum), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
