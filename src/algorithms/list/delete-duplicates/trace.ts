// =============================================================================
// 删除排序链表重复元素 · 录制帧序列
// setArray 展示链表数值；pointer 标注 cur。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  buildList,
  listToArray,
  deleteDuplicates,
  type ListNode,
  type DeleteDuplicatesHooks,
} from './impl.ts';

export const DEFAULT_INPUT = [1, 1, 2, 3, 3];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input);
  const n = input.length;
  let curIdx = -1;
  let skipIdx = -1;
  let roleTip: BarRole = 'default';

  const idxMap = new Map<ListNode, number>();
  let k = 0;
  for (let c: ListNode | null = head; c; c = c.next) idxMap.set(c, k++);

  const snap = (note: { zh: string; en: string }): void => {
    const values = listToArray(head);
    const roles: BarRole[] = new Array(n).fill('default');
    if (curIdx >= 0 && curIdx < n) roles[curIdx] = 'pivot';
    if (skipIdx >= 0 && skipIdx < n) roles[skipIdx] = roleTip;
    const pointers: Array<{ index: number; label: string }> =
      curIdx >= 0 ? [{ index: curIdx, label: 'cur' }] : [];
    if (skipIdx >= 0 && skipIdx !== curIdx) pointers.push({ index: skipIdx, label: 'next' });
    rec.begin(note).setArray(values, roles, pointers).commit();
    roleTip = 'default';
  };

  snap({ zh: `升序链表去重`, en: `Dedupe sorted list` });

  const hooks: DeleteDuplicatesHooks = {
    onCompare: (cur, cand, equal) => {
      curIdx = cur ? (idxMap.get(cur) ?? -1) : -1;
      skipIdx = cand ? (idxMap.get(cand) ?? -1) : -1;
      roleTip = equal ? 'warn' : 'compare';
      snap({
        zh: `比较 a[cur]=${cur?.value} 与 next=${cand?.value}${equal ? '（重复）' : ''}`,
        en: `Compare ${cur?.value} vs ${cand?.value}`,
      });
    },
    onSkip: (skipped) => {
      skipIdx = idxMap.get(skipped) ?? -1;
      roleTip = 'swap';
      snap({ zh: `跳过重复 ${skipped.value}`, en: `Skip dup ${skipped.value}` });
    },
    onDone: () => {},
  };

  deleteDuplicates(head, hooks);

  const finalValues = listToArray(head);
  rec
    .begin({ zh: '完成', en: 'Done' })
    .setArray(finalValues, new Array(finalValues.length).fill('final'), [])
    .commit();
  return rec.build();
}
