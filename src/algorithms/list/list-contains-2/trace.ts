import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, containsValue } from './impl.ts';
export const DEFAULT_INPUT = { arr: [4, 2, 7, 1, 9], x: 7 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input.arr);
  rec
    .begin({ zh: '查找 ' + input.x, en: 'Search ' + input.x })
    .setArray(
      [...input.arr],
      input.arr.map(() => 'default' as BarRole),
      [],
    )
    .commit();
  const found = containsValue(head, input.x, {
    onCompare: (v, hit) => {
      const i = input.arr.indexOf(v);
      const roles = input.arr.map(() => 'default' as BarRole);
      if (i >= 0) roles[i] = (hit ? 'final' : 'compare') as BarRole;
      rec
        .begin({ zh: '比较 ' + v, en: 'compare ' + v })
        .setArray([...input.arr], roles, [])
        .commit();
    },
  });
  rec
    .begin({ zh: '找到？' + found, en: 'found? ' + found })
    .setAux([{ label: 'found', value: String(found), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
