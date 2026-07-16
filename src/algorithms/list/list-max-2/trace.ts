import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listMax } from './impl.ts';
export const DEFAULT_INPUT = [3, 7, 2, 9, 5];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input);
  rec
    .begin({ zh: '求最大', en: 'Find max' })
    .setArray(
      [...input],
      input.map(() => 'default' as BarRole),
      [],
    )
    .commit();
  const m = listMax(head, {
    onCompare: (cur, best) =>
      rec
        .begin({
          zh: '比较 ' + cur + '，当前最大 ' + best,
          en: 'compare ' + cur + ', best ' + best,
        })
        .setAux([{ label: 'best', value: String(best), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '最大 = ' + m, en: 'max = ' + m })
    .setAux([{ label: 'max', value: String(m), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
