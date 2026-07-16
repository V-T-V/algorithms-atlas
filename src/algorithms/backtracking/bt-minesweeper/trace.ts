import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { updateBoard } from './impl.ts';
export const DEFAULT_INPUT = {
  board: [
    ['E', 'E', 'E', 'E', 'E'],
    ['E', 'E', 'M', 'E', 'E'],
    ['E', 'E', 'E', 'E', 'E'],
    ['E', 'E', 'E', 'E', 'E'],
  ],
  click: [3, 0] as Array<number>,
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const b = input.board.map((r) => [...r]);
  rec
    .begin({
      zh: '扫雷点击 (' + input.click[0] + ',' + input.click[1] + ')',
      en: 'Click (' + input.click[0] + ',' + input.click[1] + ')',
    })
    .commit();
  updateBoard(b, input.click, {
    onReveal: (r, c) =>
      rec
        .begin({ zh: '展开 (' + r + ',' + c + ')', en: 'reveal (' + r + ',' + c + ')' })
        .setGrid(rec.gridFrom(b.map((row) => row.map((v) => v))))
        .commit(),
  });
  rec
    .begin({ zh: '完成', en: 'Done' })
    .setGrid(rec.gridFrom(b.map((row) => row.map((v) => v))))
    .commit();
  return rec.build();
}
