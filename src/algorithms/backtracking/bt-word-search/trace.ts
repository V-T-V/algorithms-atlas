import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { exist } from './impl.ts';
export const DEFAULT_INPUT = {
  board: [
    ['A', 'B', 'C', 'E'],
    ['S', 'F', 'C', 'S'],
    ['A', 'D', 'E', 'E'],
  ],
  word: 'ABCCED',
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const b = input.board.map((r) => [...r]);
  rec.begin({ zh: '搜 "' + input.word + '"', en: 'Search ' + input.word }).commit();
  const ok = exist(b, input.word, {
    onStep: (r, c, i) =>
      rec
        .begin({
          zh: '步 ' + i + ' 在 (' + r + ',' + c + ')',
          en: 'step ' + i + ' at (' + r + ',' + c + ')',
        })
        .setAux([{ label: 'idx', value: String(i), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '找到？' + ok, en: 'found? ' + ok })
    .setAux([{ label: 'ok', value: String(ok), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
