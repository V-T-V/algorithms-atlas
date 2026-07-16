import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { copyRandomList, type RNode } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const n1: RNode = { value: 1, next: null, random: null };
  const n2: RNode = { value: 2, next: null, random: null };
  n1.next = n2;
  n1.random = n2;
  n2.random = n1;
  rec.begin({ zh: '拷贝带随机指针', en: 'Copy random list' }).commit();
  const c = copyRandomList(n1, {
    onLink: (v, rv) =>
      rec
        .begin({ zh: '节点 ' + v + ' random → ' + rv, en: 'node ' + v + ' random → ' + rv })
        .setAux([{ label: 'random', value: String(rv), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '拷贝头 = ' + (c?.value ?? null), en: 'copy head = ' + (c?.value ?? null) })
    .setAux([{ label: 'head', value: String(c?.value ?? null), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
