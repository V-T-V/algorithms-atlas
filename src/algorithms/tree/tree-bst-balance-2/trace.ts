import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, balanceFactors } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, 4];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '平衡因子', en: 'Balance factors' }).commit();
  const fs = balanceFactors(root, {
    onNode: (v, bf) =>
      rec
        .begin({ zh: '节点 ' + v + ' bf=' + bf, en: 'node ' + v + ' bf=' + bf })
        .setAux([{ label: 'bf', value: String(bf), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '共 ' + fs.length + ' 个节点', en: fs.length + ' nodes' })
    .setBars(fs.map((f) => ({ value: f.bf, role: 'final' as BarRole, label: String(f.v) })))
    .commit();
  return rec.build();
}
