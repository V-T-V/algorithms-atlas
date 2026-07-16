// =============================================================================
// 判断有环 · 录制帧序列
// setArray 展示链表数值；pointer 标注 slow/fast（用值重复表示位置）。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildCycleList, hasCycle, type ListNode, type HasCycleHooks } from './impl.ts';

export const DEFAULT_INPUT: { values: number[]; pos: number } = { values: [3, 2, 0, -4], pos: 1 };

/** 录制演示帧序列。pos 为环入口下标，<0 表示无环。 */
export function buildTrace(input: { values: number[]; pos: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { values, pos } = input;
  const head = buildCycleList(values, pos);
  const n = values.length;
  // 用引用→下标映射；注意环内节点引用唯一
  const idxMap = new Map<ListNode, number>();
  let k = 0;
  for (let c: ListNode | null = head; c && k < n; c = c.next) idxMap.set(c, k++);
  let slowIdx = -1;
  let fastIdx = -1;

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    if (slowIdx >= 0 && slowIdx < n) roles[slowIdx] = 'compare';
    if (fastIdx >= 0 && fastIdx < n) roles[fastIdx] = 'pivot';
    const pointers: Array<{ index: number; label: string }> = [];
    if (slowIdx >= 0) pointers.push({ index: slowIdx, label: 'slow' });
    if (fastIdx >= 0) pointers.push({ index: fastIdx, label: 'fast' });
    rec
      .begin(note)
      .setArray([...values], roles, pointers)
      .commit();
  };

  snap({
    zh: `快慢指针检测环${pos >= 0 ? `（入口 @${pos}）` : '（无环）'}`,
    en: `Floyd cycle detection`,
  });

  const hooks: HasCycleHooks = {
    onStep: (slow, fast) => {
      slowIdx = slow ? (idxMap.get(slow) ?? -1) : -1;
      fastIdx = fast ? (idxMap.get(fast) ?? -1) : -1;
      snap({
        zh: `slow@a[${slowIdx}]，fast@a[${fastIdx}]`,
        en: `slow@${slowIdx}, fast@${fastIdx}`,
      });
    },
    onDone: (cyc) => {
      const roles: BarRole[] = new Array(n).fill(cyc ? 'final' : 'default');
      rec
        .begin({ zh: cyc ? '有环' : '无环', en: cyc ? 'Has cycle' : 'No cycle' })
        .setArray([...values], roles, [])
        .commit();
    },
  };

  hasCycle(head, hooks);
  return rec.build();
}
