import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { wallsAndGates } from './impl.ts';
const INF = 2147483647;
export const DEFAULT_GRID = [
  [INF, -1, 0, INF],
  [INF, INF, INF, -1],
  [INF, -1, INF, -1],
  [0, -1, INF, INF],
];
export function buildTrace(grid: number[][] = DEFAULT_GRID.map((r) => [...r])): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '墙与门', en: 'Walls and gates' }).commit();
  wallsAndGates(grid, {
    onFill: (r, c, d) =>
      rec
        .begin({ zh: '填充 (' + r + ',' + c + ') = ' + d, en: 'fill (' + r + ',' + c + ') = ' + d })
        .setAux([{ label: 'dist', value: String(d), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '完成', en: 'Done' })
    .setGrid(rec.gridFrom(grid.map((row) => row.map((v) => (v === -1 ? '#' : String(v))))))
    .commit();
  return rec.build();
}
