// =============================================================================
// Splay · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { SplayTree2 } from './impl.ts';

export const DEFAULT_INPUT = [5, 1, 9, 3, 7, 8, 2];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const t = new SplayTree2({
    onSplay: (k) => {
      void k;
    },
  });

  for (const v of input) {
    t.insert(v);
    const arr = t.toArray();
    rec
      .begin({ zh: `插入 ${v}（splay 到根）`, en: `Insert ${v} (splay to root)` })
      .setBars(arr.map((x) => ({ value: x, role: 'frontier' })))
      .setAux([{ label: 'size', value: String(t.count), role: 'frontier' }])
      .commit();
  }

  // 演示一次访问
  const probe = input[Math.floor(input.length / 2)] ?? input[0]!;
  t.contains(probe);
  const arr = t.toArray();
  rec
    .begin({ zh: `访问 ${probe}，将其 splay 到根`, en: `Access ${probe}, splay it to root` })
    .setBars(arr.map((x) => ({ value: x, role: 'final' })))
    .commit();

  return rec.build();
}
