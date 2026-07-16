import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, allPaths } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, null, 5];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '所有路径', en: 'All paths' }).commit();
  const paths = allPaths(root, {
    onLeaf: (path) =>
      rec
        .begin({ zh: '叶路径 ' + path.join('→'), en: 'path ' + path.join('→') })
        .setBars(path.map((v) => ({ value: v, role: 'final' as BarRole })))
        .commit(),
  });
  rec
    .begin({ zh: '共 ' + paths.length + ' 条', en: paths.length + ' paths' })
    .setAux([{ label: 'count', value: String(paths.length), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
