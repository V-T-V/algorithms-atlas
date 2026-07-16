import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, sumNumbers } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '根到叶数字和', en: 'Sum root-leaf numbers' }).commit();
  const s = sumNumbers(root, {
    onLeaf: (num) =>
      rec
        .begin({ zh: '叶数字 ' + num, en: 'leaf num ' + num })
        .setAux([{ label: 'num', value: String(num), role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '总和 = ' + s, en: 'sum = ' + s })
    .setAux([{ label: 'sum', value: String(s), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
