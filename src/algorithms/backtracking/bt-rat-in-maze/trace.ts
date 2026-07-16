import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findMazePath } from './impl.ts';
export const DEFAULT_MAZE = [
  [0, 1, 0, 0],
  [0, 0, 0, 1],
  [1, 0, 1, 0],
  [0, 0, 0, 0],
];
export function buildTrace(maze: number[][] = DEFAULT_MAZE.map((r) => [...r])): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '迷宫老鼠', en: 'Rat in maze' }).commit();
  const p = findMazePath(maze, {
    onMove: (r, c) =>
      rec
        .begin({ zh: '走 (' + r + ',' + c + ')', en: 'move (' + r + ',' + c + ')' })
        .setGrid(rec.gridFrom(maze.map((row, i) => row.map((v, j) => String(v)))))
        .commit(),
  });
  rec
    .begin({ zh: p ? '找到路径' : '无解', en: p ? 'Found' : 'No path' })
    .setAux([{ label: 'len', value: String(p?.length ?? 0), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
