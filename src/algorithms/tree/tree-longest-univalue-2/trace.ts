import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, longestUnivaluePath } from './impl.ts';
export const DEFAULT_INPUT = [5, 4, 5, 1, 1, null, 5];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '最长同值路径', en: 'Longest univalue path' }).commit();
  const d = longestUnivaluePath(root, {
    onNode: (v, path) =>
      rec
        .begin({ zh: '节点 ' + v + ' 路径 ' + path, en: 'node ' + v + ' path ' + path })
        .setAux([{ label: 'path', value: String(path), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '最长 = ' + d, en: 'longest = ' + d })
    .setAux([{ label: 'longest', value: String(d), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
