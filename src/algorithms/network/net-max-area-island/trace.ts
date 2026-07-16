import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maxAreaOfIsland } from './impl.ts';
export const DEFAULT_GRID = [
  [0, 0, 1, 0, 0],
  [0, 1, 1, 1, 0],
  [0, 0, 1, 0, 0],
  [1, 1, 0, 0, 0],
];
export function buildTrace(grid: number[][] = DEFAULT_GRID.map((r) => [...r])): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '最大岛屿面积', en: 'Max island area' }).commit();
  const m = maxAreaOfIsland(grid, {
    onArea: (r, c, a) =>
      rec
        .begin({
          zh: '岛 (' + r + ',' + c + ') 面积 ' + a,
          en: 'island (' + r + ',' + c + ') area ' + a,
        })
        .setAux([{ label: 'area', value: String(a), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '最大面积 = ' + m, en: 'max = ' + m })
    .setAux([{ label: 'max', value: String(m), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
