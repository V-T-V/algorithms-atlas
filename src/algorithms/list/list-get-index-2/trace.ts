import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, getAt } from './impl.ts';
export const DEFAULT_INPUT = { arr: [10, 20, 30, 40], k: 2 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input.arr);
  rec
    .begin({ zh: '取第 ' + input.k + ' 个', en: 'Get index ' + input.k })
    .setArray(
      [...input.arr],
      input.arr.map(() => 'default' as BarRole),
      [],
    )
    .commit();
  const v = getAt(head, input.k, {
    onVisit: (i, val) => {
      const roles = input.arr.map(() => 'default' as BarRole);
      roles[i] = 'compare' as BarRole;
      rec
        .begin({ zh: '访问 ' + i + ' = ' + val, en: 'visit ' + i + ' = ' + val })
        .setArray([...input.arr], roles, [{ index: i, label: 'i' }])
        .commit();
    },
  });
  rec
    .begin({ zh: '结果 = ' + v, en: 'result = ' + v })
    .setAux([{ label: 'value', value: String(v), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
