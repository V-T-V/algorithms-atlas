// =============================================================================
// 合并两个有序链表 · 录制帧序列
// setAux 展示合并结果与两条输入。
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, mergeTwoSorted, type MergeTwoSortedHooks } from './impl.ts';

export const DEFAULT_INPUT: { a: number[]; b: number[] } = { a: [1, 2, 4], b: [1, 3, 4] };

/** 录制演示帧序列。 */
export function buildTrace(input: { a: number[]; b: number[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { a, b } = input;
  const headA = buildList(a);
  const headB = buildList(b);
  const out: number[] = [];
  let pick: 'a' | 'b' = 'a';

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setAux([
        { label: 'a', value: a.join(' → ') },
        { label: 'b', value: b.join(' → ') },
        { label: 'out', value: out.join(' → ') || '-', role: 'frontier' },
        { label: 'pick', value: pick },
      ])
      .commit();
  };

  snap({ zh: '合并两条升序链表', en: 'Merge two sorted lists' });

  const hooks: MergeTwoSortedHooks = {
    onCompare: (_av, _bv, p) => {
      pick = p;
    },
    onDone: () => {},
  };
  void hooks;
  // mergeTwoSorted 会改变原链表；先录最终结果
  const merged = mergeTwoSorted(headA, headB, hooks);
  out.push(...listToArray(merged));
  snap({ zh: `完成：${out.join(' → ')}`, en: `Done: ${out.join(' → ')}` });
  return rec.build();
}
