import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, maxPathSum } from './impl.ts';
export const DEFAULT_INPUT = [-10, 9, 20, null, null, 15, 7];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '最大路径和', en: 'Max path sum' }).commit();
  const m = maxPathSum(root, {
    onNode: (v, sum) =>
      rec
        .begin({ zh: '节点 ' + v + ' 路径和 ' + sum, en: 'node ' + v + ' sum ' + sum })
        .setAux([{ label: 'sum', value: String(sum), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '最大 = ' + m, en: 'max = ' + m })
    .setAux([{ label: 'max', value: String(m), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
