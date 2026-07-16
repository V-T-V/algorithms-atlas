import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { makesquare } from './impl.ts';
export const DEFAULT_INPUT = [1, 1, 2, 2, 2];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '火柴拼正方形', en: 'Matchsticks square' }).commit();
  const ok = makesquare(input, {
    onPlace: (idx, side) =>
      rec
        .begin({
          zh: '火柴 ' + input[idx] + ' 放边 ' + side,
          en: 'stick ' + input[idx] + ' side ' + side,
        })
        .setBars(
          [0, 1, 2, 3].map((s) => ({ value: 0, role: 'pivot' as BarRole, label: 'side' + s })),
        )
        .commit(),
  });
  rec
    .begin({ zh: '可拼？' + ok, en: 'ok? ' + ok })
    .setAux([{ label: 'ok', value: String(ok), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
