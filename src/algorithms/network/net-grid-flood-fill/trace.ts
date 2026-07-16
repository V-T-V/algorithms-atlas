import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { floodFill } from './impl.ts';
export const DEFAULT_INPUT = {
  grid: [
    [1, 1, 1],
    [1, 1, 0],
    [1, 0, 1],
  ],
  sr: 1,
  sc: 1,
  color: 2,
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const g = input.grid.map((r) => [...r]);
  rec.begin({ zh: 'Flood Fill 从 (1,1)', en: 'Flood fill from (1,1)' }).commit();
  floodFill(g, input.sr, input.sc, input.color, {
    onFill: (r, c) =>
      rec
        .begin({ zh: '填充 (' + r + ',' + c + ')', en: 'fill (' + r + ',' + c + ')' })
        .setGrid(rec.gridFrom(g.map((row) => row.map((v) => String(v)))))
        .commit(),
  });
  rec
    .begin({ zh: '完成', en: 'Done' })
    .setGrid(rec.gridFrom(g.map((row) => row.map((v) => String(v)))))
    .commit();
  return rec.build();
}
