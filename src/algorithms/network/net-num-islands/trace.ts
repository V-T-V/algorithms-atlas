import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { numIslands } from './impl.ts';
export const DEFAULT_GRID = [
  ['1', '1', '0', '0', '0'],
  ['1', '1', '0', '0', '0'],
  ['0', '0', '1', '0', '0'],
  ['0', '0', '0', '1', '1'],
];
export function buildTrace(grid: string[][] = DEFAULT_GRID.map((r) => [...r])): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '岛屿数量', en: 'Num islands' }).commit();
  const n = numIslands(grid, {
    onIsland: (r, c) =>
      rec
        .begin({ zh: '新岛起于 (' + r + ',' + c + ')', en: 'island at (' + r + ',' + c + ')' })
        .setGrid(rec.gridFrom(grid.map((row) => row.map((v) => v))))
        .commit(),
  });
  rec
    .begin({ zh: '共 ' + n + ' 座岛', en: n + ' islands' })
    .setAux([{ label: 'count', value: String(n), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
