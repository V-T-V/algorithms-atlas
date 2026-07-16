import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, toArray } from './impl.ts';
export const DEFAULT_INPUT = [5, 4, 3, 2, 1];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input);
  rec.begin({ zh: '链表转数组', en: 'List to array' }).commit();
  const arr = toArray(head, {
    onPush: (i, v) =>
      rec
        .begin({ zh: 'push [' + i + '] = ' + v, en: 'push [' + i + '] = ' + v })
        .setArray(
          input.slice(0, i + 1),
          input.slice(0, i + 1).map(() => 'final' as BarRole),
          [],
        )
        .commit(),
  });
  rec
    .begin({ zh: '数组 = [' + arr.join(', ') + ']', en: 'array = [' + arr.join(', ') + ']' })
    .setArray(
      arr,
      arr.map(() => 'final' as BarRole),
      [],
    )
    .commit();
  return rec.build();
}
