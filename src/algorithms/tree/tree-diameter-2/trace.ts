import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, diameter } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, 4, 5];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '求直径', en: 'Diameter' }).commit();
  const d = diameter(root, {
    onVisit: (v, path) =>
      rec
        .begin({ zh: '节点 ' + v + ' 路径 ' + path, en: 'node ' + v + ' path ' + path })
        .setAux([{ label: 'path', value: String(path), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '直径 = ' + d, en: 'diameter = ' + d })
    .setAux([{ label: 'diameter', value: String(d), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
