import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, postorder } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, 4, 5, null, 7];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '后序遍历', en: 'Postorder' }).commit();
  const out = postorder(root, {
    onVisit: (v) =>
      rec
        .begin({ zh: '访问 ' + v, en: 'visit ' + v })
        .setAux([{ label: 'current', value: String(v), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '结果：' + out.join(' → '), en: 'Result: ' + out.join(' → ') })
    .setBars(out.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
