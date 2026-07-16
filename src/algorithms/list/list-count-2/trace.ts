import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, countList } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, 4, 5];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input);
  rec
    .begin({ zh: '计数', en: 'Count' })
    .setArray(
      [...input],
      input.map(() => 'default' as BarRole),
      [],
    )
    .commit();
  const n = countList(head, {
    onVisit: (i, v) => {
      const roles = input.map(() => 'default' as BarRole);
      roles[i] = 'compare' as BarRole;
      rec
        .begin({ zh: '访问 ' + v, en: 'visit ' + v })
        .setArray([...input], roles, [{ index: i, label: 'i' }])
        .commit();
    },
  });
  rec
    .begin({ zh: '长度 = ' + n, en: 'length = ' + n })
    .setAux([{ label: 'length', value: String(n), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
