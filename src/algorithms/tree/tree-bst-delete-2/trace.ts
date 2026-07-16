import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildBST, bstDelete } from './impl.ts';
export const DEFAULT_INPUT = { keys: [5, 3, 6, 2, 4, 7], key: 3 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildBST(input.keys);
  rec.begin({ zh: '删除 ' + input.key, en: 'Delete ' + input.key }).commit();
  bstDelete(root, input.key, {
    onCase: (c) =>
      rec
        .begin({ zh: '情况：' + c, en: 'case: ' + c })
        .setAux([{ label: 'case', value: c, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '完成', en: 'Done' })
    .setAux([{ label: 'deleted', value: String(input.key), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
