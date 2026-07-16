import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, mergeTrees } from './impl.ts';
export const DEFAULT_INPUT = { a: [1, 3, 2, 5], b: [2, 1, 3, null, 4, null, 7] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = buildTree(input.a),
    b = buildTree(input.b);
  rec.begin({ zh: '合并二叉树', en: 'Merge trees' }).commit();
  const r = mergeTrees(a, b, {
    onMerge: (va, vb, sum) =>
      rec
        .begin({ zh: va + ' + ' + vb + ' = ' + sum, en: va + ' + ' + vb + ' = ' + sum })
        .setAux([{ label: 'sum', value: String(sum), role: 'pivot' as BarRole }])
        .commit(),
  });
  const arr: number[] = [];
  const q: any[] = r ? [r] : [];
  while (q.length) {
    const n = q.shift();
    arr.push(n.value);
    if (n.left) q.push(n.left);
    if (n.right) q.push(n.right);
  }
  rec
    .begin({ zh: '结果层序：' + arr.join(','), en: 'BFS: ' + arr.join(',') })
    .setBars(arr.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
