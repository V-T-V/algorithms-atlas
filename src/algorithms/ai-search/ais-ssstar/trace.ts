import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sssStar, type SssNode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();

  const tree: SssNode = {
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
    .begin({ zh: `初始化 SSS* 树`, en: `Init SSS* tree` })
    .setBars([
      { value: 3, role: 'default' as BarRole, label: 'A1' },
      { value: 5, role: 'default' as BarRole, label: 'A2' },
      { value: 2, role: 'default' as BarRole, label: 'B1' },
      { value: 9, role: 'default' as BarRole, label: 'B2' },
    ])
    .setAux([{ label: '方法', value: '状态集最佳优先', role: 'compare' as BarRole }])
    .commit();

  const result = sssStar(tree, {
    onSolve: (value) => {
      rec
        .begin({ zh: `求解值=${value}`, en: `solved value=${value}` })
        .setBars([
          { value: 3, role: 'sorted' as BarRole, label: 'A1' },
          { value: 5, role: 'default' as BarRole, label: 'A2' },
          { value: 2, role: 'default' as BarRole, label: 'B1' },
          { value: 9, role: 'default' as BarRole, label: 'B2' },
        ])
        .setAux([{ label: '值', value: String(value), role: 'final' as BarRole }])
        .commit();
    },
  });

  rec
    .begin({ zh: `完成：值=${result}`, en: `Done: value=${result}` })
    .setAux([{ label: '博弈值', value: String(result), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
