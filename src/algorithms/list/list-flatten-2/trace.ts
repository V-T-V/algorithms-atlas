import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { flatten, type MNode } from './impl.ts';
const mk = (v: number): MNode => ({ value: v, next: null, prev: null, child: null });
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const n1 = mk(1),
    n2 = mk(2),
    n3 = mk(3),
    n4 = mk(4),
    n5 = mk(5),
    n6 = mk(6),
    n7 = mk(7);
  n1.next = n2;
  n2.prev = n1;
  n2.child = n3;
  n3.next = n4;
  n4.prev = n3;
  n4.next = n5;
  n5.prev = n4;
  n2.next = n6;
  n6.prev = n2;
  n3.child = n7;
  rec.begin({ zh: '拍平多级链表', en: 'Flatten multilevel' }).commit();
  flatten(n1, {
    onInsert: (p, c) =>
      rec
        .begin({ zh: p + ' 接入子 ' + c, en: p + ' insert child ' + c })
        .setAux([{ label: 'child', value: String(c), role: 'pivot' as BarRole }])
        .commit(),
  });
  const arr: number[] = [];
  let cur: MNode | null = n1;
  while (cur) {
    arr.push(cur.value);
    cur = cur.next;
  }
  rec
    .begin({ zh: '结果：' + arr.join(' → '), en: 'Result: ' + arr.join(' → ') })
    .setArray(
      arr,
      arr.map(() => 'final' as BarRole),
      [],
    )
    .commit();
  return rec.build();
}
