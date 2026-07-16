import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildBST, kthSmallest } from './impl.ts';
export const DEFAULT_INPUT = { keys: [5, 3, 6, 2, 4, null, null, 1], k: 3 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildBST(input.keys);
  rec.begin({ zh: '第 ' + input.k + ' 小', en: 'kth smallest k=' + input.k }).commit();
  const v = kthSmallest(root, input.k, {
    onVisit: (val) =>
      rec
        .begin({ zh: '中序 ' + val, en: 'inorder ' + val })
        .setAux([{ label: 'visit', value: String(val), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '结果 = ' + v, en: 'result = ' + v })
    .setAux([{ label: 'kth', value: String(v), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
