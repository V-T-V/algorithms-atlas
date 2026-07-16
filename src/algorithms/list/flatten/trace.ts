// =============================================================================
// 展平多级链表 · 录制帧序列
// setAux 展示展平过程与结果。
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildMultiList, multiListToArray, flatten, type FlattenHooks } from './impl.ts';

export const DEFAULT_INPUT: { values: number[]; childIndex: number[] } = {
  values: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  childIndex: [4, -1, -1, -1, -1, 7, -1, -1, -1],
};

/** 录制演示帧序列。 */
export function buildTrace(
  input: { values: number[]; childIndex: number[] } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { values, childIndex } = input;
  const { head } = buildMultiList(values, childIndex);
  let phase = '';
  let childCount = 0;

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setAux([
        { label: 'phase', value: phase || '-' },
        { label: 'children', value: String(childCount), role: 'compare' },
        { label: 'flattened', value: multiListToArray(head).join(' → ') || '-', role: 'final' },
      ])
      .commit();
  };

  snap({ zh: '展平多级双向链表', en: 'Flatten multilevel list' });

  const hooks: FlattenHooks = {
    onChild: () => {
      childCount++;
      phase = `遇 child，插入到当前之后（第 ${childCount} 次）`;
      snap({ zh: phase, en: `Insert child #${childCount}` });
    },
    onDone: () => {
      phase = 'done';
    },
  };

  flatten(head, hooks);
  snap({ zh: '完成', en: 'Done' });
  return rec.build();
}
