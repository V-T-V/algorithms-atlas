import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, invertTree } from './impl.ts';
export const DEFAULT_INPUT = [4, 2, 7, 1, 3, 6, 9];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '翻转二叉树', en: 'Invert tree' }).commit();
  invertTree(root, {
    onSwap: (v) =>
      rec
        .begin({ zh: '交换 ' + v + ' 的子树', en: 'swap children of ' + v })
        .setAux([{ label: 'swap', value: String(v), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '完成', en: 'Done' })
    .setAux([{ label: 'inverted', value: 'yes', role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
