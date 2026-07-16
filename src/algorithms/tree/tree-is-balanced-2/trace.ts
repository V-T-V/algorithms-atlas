import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, isBalanced } from './impl.ts';
export const DEFAULT_INPUT = [3, 9, 20, null, null, 15, 7];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '平衡判断', en: 'Is balanced' }).commit();
  const b = isBalanced(root, {
    onVisit: (v, bal) =>
      rec
        .begin({
          zh: '节点 ' + v + (bal ? ' 平衡' : ' 不平衡'),
          en: 'node ' + v + (bal ? ' balanced' : ' unbalanced'),
        })
        .setAux([{ label: 'balanced', value: String(bal), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '平衡？' + b, en: 'balanced? ' + b })
    .setAux([{ label: 'result', value: String(b), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
