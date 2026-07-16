import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, isValidBST } from './impl.ts';
export const DEFAULT_INPUT = [5, 1, 8, null, null, 6, 9];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '验证 BST', en: 'Validate BST' }).commit();
  const ok = isValidBST(root, {
    onVisit: (v, k) =>
      rec
        .begin({ zh: '检查 ' + v + (k ? ' ✓' : ' ✗'), en: 'check ' + v + (k ? ' ok' : ' bad') })
        .setAux([{ label: 'ok', value: String(k), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '合法 BST？' + ok, en: 'valid? ' + ok })
    .setAux([{ label: 'valid', value: String(ok), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
