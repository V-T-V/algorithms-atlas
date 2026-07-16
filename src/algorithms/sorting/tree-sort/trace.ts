// =============================================================================
// 树排序 · 录制帧序列
// 通过 treeSort 的钩子，把执行过程录成 Frame[]。
// 用 setAux 展示「已访问结果」，用 setBars 展示插入进度。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { treeSort, type TreeSortHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const inserted: number[] = [];
  const visited: number[] = [];

  const snapshot = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(rec.barsFrom(inserted))
      .setAux([
        { label: 'BST 中已插入', value: inserted.join(', ') || '—', role: 'frontier' as BarRole },
        { label: '中序遍历结果', value: visited.join(', ') || '—', role: 'final' as BarRole },
      ])
      .commit();
  };

  snapshot({ zh: `初始数组：${input.join(', ')}`, en: `Initial array: ${input.join(', ')}` });

  const hooks: TreeSortHooks = {
    onInsert: (v) => {
      inserted.push(v);
      snapshot({ zh: `把 ${v} 插入 BST`, en: `Insert ${v} into BST` });
    },
    onVisit: (v) => {
      visited.push(v);
      snapshot({ zh: `中序遍历访问 ${v}`, en: `In-order visit ${v}` });
    },
  };

  treeSort(input, hooks);

  rec
    .begin({ zh: '排序完成', en: 'Sorted' })
    .setBars(visited.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
