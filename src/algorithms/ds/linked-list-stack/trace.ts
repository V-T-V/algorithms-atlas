// =============================================================================
// 链表栈 · 录制帧序列
// 用 setArray 展示栈内容（数组形式，末尾为栈顶），pointers 标记 top。
// 当前 push/pop 的元素标 'compare'/'swap'，末帧标 'final'。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { LinkedListStack } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3];

/** 录制演示帧序列。 */
export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const stackObj = new LinkedListStack();

  let activeIdx = -1; // 当前帧高亮的下标
  let activeRole: BarRole = 'compare';

  const snapshot = (note: { zh: string; en: string }): void => {
    const stack = stackObj.toArray();
    const roles: BarRole[] = stack.map(() => 'default');
    if (activeIdx >= 0 && activeIdx < roles.length) roles[activeIdx] = activeRole;
    const pointers = stack.length > 0 ? [{ index: stack.length - 1, label: 'top' }] : [];
    rec.begin(note).setArray(stack, roles, pointers).commit();
    activeIdx = -1;
  };

  snapshot({ zh: '空栈，开始压栈', en: 'Empty stack, start pushing' });

  // —— 阶段 1：逐个压栈 ——
  for (const v of input) {
    stackObj.push(v);
    activeIdx = stackObj.size - 1;
    activeRole = 'compare';
    snapshot({ zh: `压栈 ${v}（栈顶 = top）`, en: `Push ${v} (top = top)` });
  }

  // —— 阶段 2：逐个弹栈（LIFO → 逆序）——
  const popped: number[] = [];
  while (!stackObj.isEmpty()) {
    const v = stackObj.pop();
    if (v !== undefined) popped.push(v);
    // 标记"刚弹出的位置"=原栈顶（现在 size 处，越界表示已离开）
    activeIdx = stackObj.size;
    activeRole = 'swap';
    snapshot({
      zh: `弹栈 ${v}（LIFO，最先弹出的栈顶）`,
      en: `Pop ${v} (LIFO, topmost first)`,
    });
  }

  // 终态
  rec
    .begin({
      zh: `完成；弹出序列：[${popped.join(', ')}]（输入的逆序）`,
      en: `Done; popped: [${popped.join(', ')}] (reverse of input)`,
    })
    .setBars(popped.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
