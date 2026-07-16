import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, flatten } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 5, 3, 4, null, 6];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '展开为链表', en: 'Flatten' }).commit();
  flatten(root, {
    onSplice: (p, c) =>
      rec
        .begin({ zh: p + ' 接右 ' + (c ?? 'null'), en: p + ' → right ' + (c ?? 'null') })
        .setAux([{ label: 'splice', value: String(c), role: 'pivot' as BarRole }])
        .commit(),
  });
  const arr: number[] = [];
  let cur = root;
  while (cur) {
    arr.push(cur.value);
    cur = cur.right;
  }
  rec
    .begin({ zh: '结果：' + arr.join(' → '), en: 'Result: ' + arr.join(' → ') })
    .setBars(arr.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
