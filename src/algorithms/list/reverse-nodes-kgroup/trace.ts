// =============================================================================
// K 个一组反转链表 · 录制帧序列
// 用 setArray 展示当前链表值序列，每段反转后成帧。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  reverseKGroup,
  buildList,
  toArray,
  type ListNode,
  type ReverseKGroupHooks,
} from './impl.ts';

export const DEFAULT_INPUT = { values: [1, 2, 3, 4, 5], k: 2 };

export function buildTrace(input: { values: number[]; k: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input.values);
  let curValues = [...input.values];

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setArray(
        curValues,
        curValues.map(() => 'default' as BarRole),
        [],
      )
      .setAux([{ label: 'k', value: String(input.k), role: 'pivot' as BarRole }])
      .commit();
  };

  snap({
    zh: `初始链表：[${input.values.join(', ')}]，k = ${input.k}`,
    en: `Initial list: [${input.values.join(', ')}], k = ${input.k}`,
  });

  const hooks: ReverseKGroupHooks = {
    onGroupFound: (segHead) => {
      // 高亮当前段（curValues 中尚未变化）
      const segValues: number[] = [];
      let cur: ListNode | null = segHead;
      while (cur) {
        segValues.push(cur.value);
        cur = cur.next;
      }
      void segValues;
    },
    onGroupReversed: () => {
      curValues = toArray(head);
      snap({
        zh: `反转一段后：[${curValues.join(', ')}]`,
        en: `After reversing a group: [${curValues.join(', ')}]`,
      });
    },
    onShortTail: (count, k) => {
      snap({
        zh: `剩余 ${count} < ${k}，保留原序`,
        en: `Leftover ${count} < ${k}, keep as-is`,
      });
    },
  };

  reverseKGroup(head, input.k, hooks);

  const final = toArray(head);
  rec
    .begin({
      zh: `完成：[${final.join(', ')}]`,
      en: `Done: [${final.join(', ')}]`,
    })
    .setArray(
      final,
      final.map(() => 'final' as BarRole),
      [],
    )
    .commit();

  return rec.build();
}
