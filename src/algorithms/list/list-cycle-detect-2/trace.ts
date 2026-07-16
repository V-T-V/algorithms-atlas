import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, hasCycle } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  // 构造一个有环链表 1->2->3->4->2
  const n1 = { value: 1, next: null } as any,
    n2 = { value: 2, next: null } as any,
    n3 = { value: 3, next: null } as any,
    n4 = { value: 4, next: null } as any;
  n1.next = n2;
  n2.next = n3;
  n3.next = n4;
  n4.next = n2;
  rec.begin({ zh: '带环链表 1→2→3→4→2', en: 'Cyclic list' }).commit();
  const has = hasCycle(n1, {
    onStep: (s, f) =>
      rec
        .begin({ zh: 'slow=' + s + ' fast=' + f, en: 'slow=' + s + ' fast=' + f })
        .setAux([
          { label: 'slow', value: String(s), role: 'pivot' as BarRole },
          { label: 'fast', value: String(f), role: 'frontier' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: '有环？' + has, en: 'has cycle? ' + has })
    .setAux([{ label: 'hasCycle', value: String(has), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
