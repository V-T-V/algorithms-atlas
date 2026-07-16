import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { LinkedList } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 3, 4];

export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const list = new LinkedList();
  for (const v of input) list.push(v);
  rec
    .begin({ zh: `链表：[${input.join(' → ')}]`, en: `List: [${input.join(' → ')}]` })
    .setAux([{ label: '长度', value: String(list.size), role: 'pivot' as BarRole }])
    .commit();
  const visited: number[] = [];
  const it = list.forwardIterator({
    onHasNext: (has) =>
      rec
        .begin({ zh: `hasNext=${has}`, en: `hasNext=${has}` })
        .setAux([{ label: 'hasNext', value: String(has), role: 'compare' as BarRole }])
        .commit(),
    onNext: (v) => {
      visited.push(v);
      rec
        .begin({ zh: `next → ${v}`, en: `next → ${v}` })
        .setAux([{ label: '已遍历', value: visited.join(','), role: 'frontier' as BarRole }])
        .commit();
    },
  });
  while (it.hasNext()) it.next();
  // 反向遍历
  const revVisited: number[] = [];
  const rit = list.reverseIterator({
    onNext: (v) => {
      revVisited.push(v);
    },
  });
  while (rit.hasNext()) rit.next();
  rec
    .begin({
      zh: `正向=[${visited.join(',')}], 反向=[${revVisited.join(',')}]`,
      en: `Forward=[${visited.join(',')}], Reverse=[${revVisited.join(',')}]`,
    })
    .setAux([
      { label: '正向', value: visited.join(','), role: 'final' as BarRole },
      { label: '反向', value: revVisited.join(','), role: 'sorted' as BarRole },
    ])
    .commit();
  return rec.build();
}
