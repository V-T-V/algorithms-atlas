// =============================================================================
// 分隔链表 · 录制帧序列
// setArray 展示链表数值；pointer 标注当前处理节点。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  buildList,
  listToArray,
  partitionList,
  type ListNode,
  type PartitionListHooks,
} from './impl.ts';

export const DEFAULT_INPUT: { values: number[]; x: number } = { values: [1, 4, 3, 2, 5, 2], x: 3 };

/** 录制演示帧序列。 */
export function buildTrace(input: { values: number[]; x: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { values, x } = input;
  const head = buildList(values);
  const n = values.length;
  const lessIdx: boolean[] = new Array(n).fill(false);
  const geIdx: boolean[] = new Array(n).fill(false);
  let curIdx = -1;

  const idxMap = new Map<ListNode, number>();
  let k = 0;
  for (let c: ListNode | null = head; c; c = c.next) idxMap.set(c, k++);

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    for (let i = 0; i < n; i++) {
      if (lessIdx[i]) roles[i] = 'final';
      else if (geIdx[i]) roles[i] = 'warn';
    }
    if (curIdx >= 0) roles[curIdx] = 'pivot';
    const pointers: Array<{ index: number; label: string }> =
      curIdx >= 0 ? [{ index: curIdx, label: 'cur' }] : [];
    rec
      .begin(note)
      .setArray([...values], roles, pointers)
      .commit();
  };

  snap({ zh: `按 ${x} 分隔`, en: `Partition around ${x}` });

  const hooks: PartitionListHooks = {
    onClassify: (_value, _side) => {
      /* 用 value 找下标 */
    },
    onDone: () => {},
  };
  void hooks;
  // 先扫描标记（不依赖 hooks 下标）
  let cur: ListNode | null = head;
  let i = 0;
  while (cur) {
    curIdx = i;
    if (cur.value < x) lessIdx[i] = true;
    else geIdx[i] = true;
    hooks.onClassify?.(cur.value, cur.value < x ? 'less' : 'ge');
    snap({
      zh: `${cur.value} ${cur.value < x ? '<' : '>='} ${x} → ${cur.value < x ? 'less' : 'ge'}`,
      en: `${cur.value} → ${cur.value < x ? 'less' : 'ge'}`,
    });
    cur = cur.next;
    i++;
  }

  const newHead = partitionList(buildList(values), x);
  const finalValues = listToArray(newHead);
  rec
    .begin({ zh: `完成：${finalValues.join(' → ')}`, en: `Done: ${finalValues.join(' → ')}` })
    .setArray(finalValues, new Array(finalValues.length).fill('final'), [])
    .commit();
  return rec.build();
}
