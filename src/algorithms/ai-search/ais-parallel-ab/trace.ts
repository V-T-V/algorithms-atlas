import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { parallelAlphaBeta, type AbNode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const tree: AbNode = {
    id: 'root',
    children: [
      {
        id: 'A',
        children: [
          { id: 'A1', utility: 3 },
          { id: 'A2', utility: 9 },
        ],
      },
      {
        id: 'B',
        children: [
          { id: 'B1', utility: 5 },
          { id: 'B2', utility: 2 },
        ],
      },
      {
        id: 'C',
        children: [
          { id: 'C1', utility: 7 },
          { id: 'C2', utility: 1 },
        ],
      },
    ],
  };
  const bars = (hi: string[] = []) =>
    [3, 9, 5, 2, 7, 1].map((v, i) => ({
      value: v,
      role: (hi.includes(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'][i]!) ? 'swap' : 'default') as BarRole,
      label: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'][i],
    }));

  rec
    .begin({
      zh: '并行 α-β：先搜长子 A 建立窗口',
      en: 'Parallel α-β: search eldest A to set window',
    })
    .setBars(bars(['A2']))
    .setAux([{ label: '阶段', value: 'PV 建立', role: 'compare' as BarRole }])
    .commit();

  parallelAlphaBeta(tree, 2, 2, {
    onPvEstablished: (a) => {
      rec
        .begin({ zh: `窗口建立 α=${a}`, en: `Window set α=${a}` })
        .setBars(bars(['A2']))
        .setAux([{ label: 'α', value: String(a), role: 'final' as BarRole }])
        .commit();
    },
    onSearchChild: (id) => {
      rec
        .begin({ zh: `并行搜索 ${id}`, en: `Parallel search ${id}` })
        .setBars(bars([id]))
        .setAux([{ label: '节点', value: id, role: 'frontier' as BarRole }])
        .commit();
    },
    onPrune: (id) => {
      rec
        .begin({ zh: `剪枝 ${id}（值 ≤ α）`, en: `Prune ${id} (val ≤ α)` })
        .setBars(bars([]))
        .setAux([{ label: '剪枝', value: id, role: 'warn' as BarRole }])
        .commit();
    },
    onResult: (v) => {
      rec
        .begin({ zh: `完成：根值=${v}`, en: `Done: root=${v}` })
        .setAux([{ label: '博弈值', value: String(v), role: 'final' as BarRole }])
        .commit();
    },
  });
  return rec.build();
}
