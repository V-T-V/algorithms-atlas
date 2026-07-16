// =============================================================================
// Treap · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Treap2 } from './impl.ts';

export const DEFAULT_INPUT = [7, 3, 9, 1, 5, 8, 4];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const t = new Treap2();

  for (const v of input) {
    t.insert(v);
    const arr = t.toArray();
    rec
      .begin({ zh: `插入 ${v}`, en: `Insert ${v}` })
      .setBars(arr.map((x) => ({ value: x, role: 'frontier' })))
      .setAux([{ label: 'size', value: String(t.count), role: 'frontier' }])
      .commit();
  }

  const arr = t.toArray();
  rec
    .begin({ zh: `Treap 完成：[${arr.join(',')}]`, en: `Treap done: [${arr.join(',')}]` })
    .setBars(arr.map((x) => ({ value: x, role: 'final' })))
    .commit();

  return rec.build();
}
