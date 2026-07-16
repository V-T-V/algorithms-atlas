import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { iterativeDeepeningOrdered, type Id2Node } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();

  // 简单博弈树：根两子，每子两叶
  const tree: Id2Node = {
    id: 'root',
    children: [
      {
        id: 'A',
        children: [
          { id: 'A1', utility: 3 },
          { id: 'A2', utility: 5 },
        ],
      },
      {
        id: 'B',
        children: [
          { id: 'B1', utility: 2 },
          { id: 'B2', utility: 9 },
        ],
      },
    ],
  };

  rec
    .begin({ zh: `初始化博弈树`, en: `Init game tree` })
    .setBars([
      { value: 3, role: 'default' as BarRole, label: 'A1' },
      { value: 5, role: 'default' as BarRole, label: 'A2' },
      { value: 2, role: 'default' as BarRole, label: 'B1' },
      { value: 9, role: 'default' as BarRole, label: 'B2' },
    ])
    .setAux([{ label: '方法', value: 'IDDFS+排序', role: 'compare' as BarRole }])
    .commit();

  const res = iterativeDeepeningOrdered(tree, 2, {
    onDepthEnd: (d, value, nodes) => {
      rec
        .begin({
          zh: `depth=${d} 值=${value} 节点=${nodes}`,
          en: `depth=${d} value=${value} nodes=${nodes}`,
        })
        .setBars([
          { value: 3, role: 'default' as BarRole, label: 'A1' },
          { value: 5, role: 'default' as BarRole, label: 'A2' },
          { value: 2, role: 'default' as BarRole, label: 'B1' },
          { value: 9, role: 'default' as BarRole, label: 'B2' },
        ])
        .setAux([
          { label: '值', value: String(value), role: 'final' as BarRole },
          { label: '节点', value: String(nodes), role: 'compare' as BarRole },
        ])
        .commit();
    },
  });

  rec
    .begin({
      zh: `完成：值=${res.score} 最佳=${res.bestChildId}`,
      en: `Done: value=${res.score} best=${res.bestChildId}`,
    })
    .setAux([
      { label: '分值', value: String(res.score), role: 'final' as BarRole },
      { label: '最佳子', value: res.bestChildId ?? '?', role: 'compare' as BarRole },
    ])
    .commit();
  return rec.build();
}
