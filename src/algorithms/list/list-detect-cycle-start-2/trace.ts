import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { detectCycleStart } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const n1: any = { value: 1, next: null },
    n2: any = { value: 2, next: null },
    n3: any = { value: 3, next: null },
    n4: any = { value: 4, next: null };
  n1.next = n2;
  n2.next = n3;
  n3.next = n4;
  n4.next = n2;
  rec.begin({ zh: '找环入口', en: 'Find cycle start' }).commit();
  const node = detectCycleStart(n1, {
    onMeet: (s, f) =>
      rec
        .begin({ zh: '相遇 slow=' + s + ' fast=' + f, en: 'meet slow=' + s + ' fast=' + f })
        .setAux([{ label: 'meet', value: String(s), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '入口 = ' + (node?.value ?? null), en: 'start = ' + (node?.value ?? null) })
    .setAux([{ label: 'start', value: String(node?.value ?? null), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
