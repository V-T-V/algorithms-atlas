// =============================================================================
// 合并 K 个有序链表 · 录制帧序列
// 用 setArray 展示合并结果（逐步增长），pointers 标各链表当前头位置。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fromArray, mergeKSorted, toArray } from './impl.ts';

/** 默认演示：3 条升序链表。 */
export const DEFAULT_INPUT: number[][] = [
  [1, 4, 7, 10],
  [2, 5, 8, 11],
  [3, 6, 9, 12],
];

/** 录制演示帧序列。 */
export function buildTrace(input: number[][] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const lists = input.map(fromArray);
  const result: number[] = [];
  const headValueByList: Array<number | null> = lists.map((h) => (h ? h.value : null));
  let justAppended: number | null = null;
  let heapHeadValues: number[] = [];

  const snapshot = (note: { zh: string; en: string }): void => {
    // 展示结果数组；未填满的位置用 0 占位？改为只展示当前长度。
    const values = [...result];
    const roles: BarRole[] = values.map(() => 'frontier');
    if (justAppended !== null && values.length > 0) {
      roles[values.length - 1] = 'final';
    }
    // pointers：每条链表当前头在结果数组中没有「位置」，改用 aux 展示链表头；
    // 这里用 pointers 指向结果数组末尾作为「写入位」。
    const pointers: Array<{ index: number; label: string }> = [];
    if (values.length > 0) {
      pointers.push({ index: values.length - 1, label: 'write' });
    }
    const aux = [
      ...lists.map((_, i) => ({
        label: `L${i}`,
        value: headValueByList[i] === null ? '∅' : String(headValueByList[i]),
        role: (heapHeadValues.includes(headValueByList[i]!) ? 'compare' : 'default') as BarRole,
      })),
      {
        label: 'heap',
        value: `[${heapHeadValues.join(', ')}]`,
        role: 'pivot' as BarRole,
      },
    ];
    rec.begin(note).setArray(values, roles, pointers).setAux(aux).commit();
    justAppended = null;
  };

  // 计算初始堆内容
  heapHeadValues = lists.map((h) => (h ? h.value : null)).filter((v): v is number => v !== null);

  snapshot({
    zh: `K=${lists.length} 条有序链表，初始堆放入各链表头：[${heapHeadValues.join(', ')}]`,
    en: `K=${lists.length} sorted lists, initial heap of list heads: [${heapHeadValues.join(', ')}]`,
  });

  mergeKSorted(lists, {
    onInit: () => {
      // 已在 snapshot 中体现
    },
    onPop: (value, listIdx) => {
      justAppended = value;
      result.push(value);
      headValueByList[listIdx] = null; // 暂时标记为已弹出
      // 从堆中移除该值
      const idx = heapHeadValues.indexOf(value);
      if (idx >= 0) heapHeadValues.splice(idx, 1);
      snapshot({
        zh: `弹出堆顶 ${value}（来自 L${listIdx}），追加到结果`,
        en: `Pop heap top ${value} (from L${listIdx}), append to result`,
      });
    },
    onAdvance: (listIdx, nextValue) => {
      headValueByList[listIdx] = nextValue;
      if (nextValue !== null) heapHeadValues.push(nextValue);
      snapshot({
        zh: nextValue === null ? `L${listIdx} 已耗尽` : `L${listIdx} 前进，新头 ${nextValue} 入堆`,
        en:
          nextValue === null
            ? `L${listIdx} exhausted`
            : `L${listIdx} advances, new head ${nextValue} pushed to heap`,
      });
    },
    onAppend: () => {
      // 已在 onPop 的 snapshot 中体现
    },
  });

  // 终态
  const finalValues = toArray(mergeKSorted(input.map(fromArray)));
  rec
    .begin({
      zh: `合并完成：${finalValues.join(', ')}`,
      en: `Merged: ${finalValues.join(', ')}`,
    })
    .setArray(
      finalValues,
      finalValues.map(() => 'final'),
      [],
    )
    .setAux([
      { label: '总长', value: String(finalValues.length), role: 'final' },
      { label: 'K', value: String(input.length), role: 'final' },
    ])
    .commit();

  return rec.build();
}
