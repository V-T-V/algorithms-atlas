import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { orangesRotting } from './impl.ts';
export const DEFAULT_GRID = [
  [2, 1, 1],
  [1, 1, 0],
  [0, 1, 1],
];
export function buildTrace(grid: number[][] = DEFAULT_GRID.map((r) => [...r])): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '腐烂橘子', en: 'Rotten oranges' }).commit();
  const m = orangesRotting(grid, {
    onRot: (r, c, mm) =>
      rec
        .begin({
          zh: '腐烂 (' + r + ',' + c + ') 第 ' + mm + ' 分钟',
          en: 'rot (' + r + ',' + c + ') min ' + mm,
        })
        .setAux([{ label: 'min', value: String(mm), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '分钟 = ' + m, en: 'minutes = ' + m })
    .setAux([{ label: 'minutes', value: String(m), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
