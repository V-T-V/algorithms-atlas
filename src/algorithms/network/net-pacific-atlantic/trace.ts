import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pacificAtlantic } from './impl.ts';
export const DEFAULT_GRID = [
  [1, 2, 2, 3, 5],
  [3, 2, 3, 4, 4],
  [2, 4, 5, 3, 1],
  [6, 7, 1, 4, 5],
  [5, 1, 1, 2, 4],
];
export function buildTrace(grid: number[][] = DEFAULT_GRID): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '太平洋大西洋水流', en: 'Pacific Atlantic' }).commit();
  const cells = pacificAtlantic(grid, {
    onCell: (r, c) =>
      rec
        .begin({ zh: '汇点 (' + r + ',' + c + ')', en: 'cell (' + r + ',' + c + ')' })
        .setAux([{ label: 'cell', value: r + ',' + c, role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '共 ' + cells.length + ' 个', en: cells.length + ' cells' })
    .setAux([{ label: 'count', value: String(cells.length), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
