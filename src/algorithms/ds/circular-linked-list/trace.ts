// =============================================================================
// 循环链表 · 录制帧序列
// 演示约瑟夫环（Josephus）：构造环后每数到 step 出环一人。
// 用 setBars 展示环上剩余节点；当前计数节点标 'compare'，本轮出环节点标 'swap'，
// 已出环节点不再显示。用 setAux 展示剩余人数 / 当前步数。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { CircularLinkedList, type CircularLinkedListHooks } from './impl.ts';

/** 演示：n 人围成环，从 head 起每数到 k 出环，直到全部出环。 */
export const DEFAULT_INPUT = {
  n: 7,
  k: 3, // 经典 n=7,k=3 → 出环序列 [3,6,2,7,5,1,4]
};

/** 录制演示帧序列。 */
export function buildTrace(input: { n: number; k: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const list = new CircularLinkedList();
  for (let v = 1; v <= input.n; v++) list.insert(v);

  let stepCount = 0;
  let currentVal: number | null = null;
  let removedVal: number | null = null;
  const eliminated: number[] = [];

  const snapshot = (note: { zh: string; en: string }): void => {
    const arr = list.toArray();
    const roles: Record<number, BarRole> = {};
    for (let i = 0; i < arr.length; i++) {
      if (currentVal !== null && arr[i] === currentVal) roles[i] = 'compare';
      else if (removedVal !== null && arr[i] === removedVal) roles[i] = 'swap';
      else roles[i] = 'sorted';
    }
    rec
      .begin(note)
      .setBars(rec.barsFrom(arr, roles))
      .setAux([
        { label: '剩余', value: String(list.size), role: 'final' },
        { label: '步数', value: String(stepCount), role: 'compare' },
        { label: '出环序列', value: `[${eliminated.join(', ')}]`, role: 'warn' },
      ])
      .commit();
    currentVal = null;
    removedVal = null;
  };

  snapshot({
    zh: `${input.n} 人围成环（顺时针）`,
    en: `${input.n} people form a ring (clockwise)`,
  });

  const hooks: CircularLinkedListHooks = {
    onVisit: (step, value) => {
      stepCount = step;
      currentVal = value;
      if (step % input.k === 0) {
        snapshot({
          zh: `数到 ${value}（第 ${input.k} 个，出环）`,
          en: `Count reaches ${value} (every ${input.k}-th, out)`,
        });
      } else {
        snapshot({ zh: `报数 ${value}`, en: `Count ${value}` });
      }
    },
    onRemove: (value) => {
      removedVal = value;
      eliminated.push(value);
      snapshot({ zh: `${value} 出环`, en: `${value} eliminated` });
    },
  };

  list.josephus(input.k, hooks);

  // 终态
  rec
    .begin({
      zh: `出环顺序：[${eliminated.join(', ')}]`,
      en: `Elimination order: [${eliminated.join(', ')}]`,
    })
    .setBars(eliminated.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
