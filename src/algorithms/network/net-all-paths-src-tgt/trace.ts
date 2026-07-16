import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { allPathsSourceTarget } from './impl.ts';
export const DEFAULT_INPUT = [[1, 2], [3], [3], []];
export function buildTrace(input: number[][] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '源到汇所有路径', en: 'All paths' }).commit();
  const paths = allPathsSourceTarget(input, {
    onPath: (p) =>
      rec
        .begin({ zh: '路径 ' + p.join('→'), en: 'path ' + p.join('→') })
        .setBars(p.map((v) => ({ value: v, role: 'final' as BarRole })))
        .commit(),
  });
  rec
    .begin({ zh: '共 ' + paths.length + ' 条', en: paths.length + ' paths' })
    .setAux([{ label: 'count', value: String(paths.length), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
