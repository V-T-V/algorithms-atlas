import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listSum } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, 4, 5];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input);
  rec
    .begin({ zh: '求和', en: 'Sum' })
    .setArray(
      [...input],
      input.map(() => 'default' as BarRole),
      [],
    )
    .commit();
  const s = listSum(head, {
    onAcc: (cur, total) =>
      rec
        .begin({ zh: '+' + cur + ' → ' + total, en: '+' + cur + ' → ' + total })
        .setAux([{ label: 'total', value: String(total), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '和 = ' + s, en: 'sum = ' + s })
    .setAux([{ label: 'sum', value: String(s), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
