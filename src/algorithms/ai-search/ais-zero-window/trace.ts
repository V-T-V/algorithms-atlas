import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { zeroWindow, type ZNode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const tree: ZNode = {
    id: 'r',
    children: [
      { id: 'a', utility: 3 },
      { id: 'b', utility: 7 },
      { id: 'c', utility: 5 },
    ],
  };
  rec
    .begin({ zh: '零窗口 β=5', en: 'zero-window β=5' })
    .setBars([3, 7, 5].map((v, i) => ({ value: v, role: 'default' as BarRole, label: 'abc'[i] })))
    .commit();
  for (const beta of [5, 8, 4]) {
    zeroWindow(tree, beta, 1, {
      onTest: (b, v) =>
        rec
          .begin({ zh: `Test β=${b} → ${v}`, en: `Test β=${b} → ${v}` })
          .setAux([{ label: 'β', value: String(b), role: 'compare' as BarRole }])
          .commit(),
      onBound: (bd, v) =>
        rec
          .begin({ zh: `${bd}=${v}`, en: `${bd}=${v}` })
          .setAux([
            { label: bd, value: String(v), role: (bd === 'lower' ? 'final' : 'swap') as BarRole },
          ])
          .commit(),
    });
  }
  return rec.build();
}
