import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { runPipeline } from './impl.ts';
const fs: Array<(x: number[]) => number[]> = [
  (x) => x.map((v) => v + 1),
  (x) => x.filter((v) => v > 3),
  (x) => x.map((v) => v * 2),
];
export const DEFAULT_INPUT: any = [1, 2, 3, 4, 5];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '管道过滤器', en: 'Pipes and Filters' }).commit();
  const out = runPipeline(input, fs, {
    onFilter: (i, inp, outp) =>
      rec
        .begin({ zh: '过滤 ' + i, en: 'filter' })
        .setAux([
          { label: 'i', value: String(i), role: 'compare' as BarRole },
          { label: 'in', value: (inp as number[]).join(','), role: 'pivot' as BarRole },
          { label: 'out', value: (outp as number[]).join(','), role: 'final' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: '结果 [' + out.join(',') + ']', en: 'out' })
    .setAux([{ label: 'out', value: out.join(','), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
