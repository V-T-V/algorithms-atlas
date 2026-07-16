import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { softSearch, type SPNode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const tree: SPNode = {
    id: 'r',
    children: [
      { id: 'a', utility: 3 },
      { id: 'b', utility: 7 },
      { id: 'c', utility: 5 },
      { id: 'd', utility: 9 },
    ],
  };
  rec
    .begin({ zh: '软剪枝：slack=2', en: 'soft prune slack=2' })
    .setBars(
      [3, 7, 5, 9].map((v, i) => ({ value: v, role: 'default' as BarRole, label: 'abcd'[i] })),
    )
    .setAux([{ label: 'slack', value: '2', role: 'compare' as BarRole }])
    .commit();
  softSearch(tree, 2, 1, {
    onSoftBound: (b, v) => {
      rec
        .begin({ zh: `软${b}界=${v}`, en: `soft ${b}=${v}` })
        .setAux([{ label: '软界', value: `${b}=${v}`, role: 'frontier' as BarRole }])
        .commit();
    },
    onHardCut: (id) => {
      rec
        .begin({ zh: `硬剪枝 ${id}`, en: `hard cut ${id}` })
        .setAux([{ label: '剪枝', value: id, role: 'warn' as BarRole }])
        .commit();
    },
    onResult: (v) => {
      rec
        .begin({ zh: `完成=${v}`, en: `done=${v}` })
        .setAux([{ label: '值', value: String(v), role: 'final' as BarRole }])
        .commit();
    },
  });
  return rec.build();
}
