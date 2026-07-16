import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildBST, insertTracked } from './impl.ts';
export const DEFAULT_INPUT = { keys: [50, 30, 70], insert: 40 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let root = buildBST(input.keys);
  rec.begin({ zh: 'BST 插入 ' + input.insert, en: 'Insert ' + input.insert }).commit();
  root = insertTracked(root, input.insert, {
    onCompare: (cur, dir) =>
      rec
        .begin({ zh: cur + ' → ' + dir, en: cur + ' → ' + dir })
        .setAux([{ label: 'dir', value: dir, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '完成', en: 'Done' })
    .setAux([{ label: 'inserted', value: String(input.insert), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
