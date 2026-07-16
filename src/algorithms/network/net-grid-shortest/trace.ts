import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { shortestPathBinaryMatrix } from './impl.ts';
export const DEFAULT_GRID = [
  [0, 1],
  [1, 0],
];
export function buildTrace(grid: number[][] = DEFAULT_GRID.map((r) => [...r])): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '网格最短路径', en: 'Grid shortest path' }).commit();
  const len = shortestPathBinaryMatrix(grid, {
    onVisit: (r, c, d) =>
      rec
        .begin({
          zh: '访问 (' + r + ',' + c + ') 步 ' + d,
          en: 'visit (' + r + ',' + c + ') d=' + d,
        })
        .setAux([{ label: 'step', value: String(d), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '长度 = ' + len, en: 'length = ' + len })
    .setAux([{ label: 'length', value: String(len), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
