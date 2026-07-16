import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, countUnival } from './impl.ts';
export const DEFAULT_INPUT = [5, 1, 5, 5, 5, null, 5];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '同值子树', en: 'Unival subtrees' }).commit();
  const n = countUnival(root, {
    onUnival: (v) =>
      rec
        .begin({ zh: '同值子树根 ' + v, en: 'unival root ' + v })
        .setAux([{ label: 'root', value: String(v), role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '共 ' + n + ' 个', en: n + ' unival' })
    .setAux([{ label: 'count', value: String(n), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
