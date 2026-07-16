import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { canFinish } from './impl.ts';
export const DEFAULT_INPUT = {
  n: 4,
  pre: [
    [1, 0],
    [2, 1],
    [3, 2],
  ] as Array<[number, number]>,
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '课程表 ' + input.n + ' 门', en: 'Course schedule ' + input.n }).commit();
  const ok = canFinish(input.n, input.pre, {
    onTake: (c) =>
      rec
        .begin({ zh: '修课 ' + c, en: 'take ' + c })
        .setAux([{ label: 'course', value: String(c), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '能完成？' + ok, en: 'ok? ' + ok })
    .setAux([{ label: 'ok', value: String(ok), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
