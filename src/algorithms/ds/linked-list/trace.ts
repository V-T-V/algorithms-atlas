// =============================================================================
// 单链表 · 录制帧序列
// 用 setBars 展示链表节点序列（头插构建，故倒序展示插入过程）。
// 当前比较节点标 'compare'，命中标 'pivot'，新增节点标 'final'，
// 待删/已删标 'swap'。用 setAux 展示 size / head 值。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { LinkedList, type LinkedListHooks } from './impl.ts';

/** 演示：头插构建链表，再查找一个命中与一个未命中，最后删除一个。 */
export const DEFAULT_INPUT = {
  insert: [10, 20, 30, 40], // 头插 → [40,30,20,10]
  searchHits: 20,
  searchMiss: 99,
  delete: 30,
};

/** 录制演示帧序列。 */
export function buildTrace(
  input: {
    insert: readonly number[];
    searchHits?: number;
    searchMiss?: number;
    delete?: number;
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const list = new LinkedList();

  let compareIdx = -1;
  let hitIdx = -1;
  let newIdx = -1;
  let delIdx = -1;

  const snapshot = (note: { zh: string; en: string }): void => {
    const arr = list.toArray(); // head→tail
    const roles: Record<number, BarRole> = {};
    for (let i = 0; i < arr.length; i++) {
      if (i === delIdx) roles[i] = 'swap';
      else if (i === hitIdx) roles[i] = 'pivot';
      else if (i === compareIdx) roles[i] = 'compare';
      else if (i === newIdx) roles[i] = 'final';
      else roles[i] = 'sorted';
    }
    rec
      .begin(note)
      .setBars(rec.barsFrom(arr, roles))
      .setAux([
        { label: 'size', value: String(list.size), role: 'final' },
        { label: 'head', value: list.isEmpty() ? 'null' : String(arr[0]!), role: 'pivot' },
      ])
      .commit();
    compareIdx = hitIdx = newIdx = delIdx = -1;
  };

  snapshot({ zh: '空链表，head = null', en: 'Empty list, head = null' });

  const hooks: LinkedListHooks = {
    onInsert: (index, value) => {
      newIdx = index;
      snapshot({ zh: `头插 ${value}（新 head）`, en: `Head insert ${value} (new head)` });
    },
    onCompare: (index, value, hit) => {
      compareIdx = index;
      if (hit) hitIdx = index;
      void value;
    },
    onFound: (index, value) => {
      hitIdx = index;
      snapshot({ zh: `命中 ${value}（下标 ${index}）`, en: `Found ${value} (index ${index})` });
    },
    onDelete: (index, value) => {
      delIdx = index;
      snapshot({
        zh: `删除 ${value}（前驱 next 跳过它）`,
        en: `Delete ${value} (predecessor.next skips it)`,
      });
    },
  };

  // 阶段 1：头插构建
  for (const v of input.insert) list.insertHead(v, hooks);

  // 阶段 2：查找（命中 + 未命中）
  if (input.searchHits !== undefined) {
    const i = list.search(input.searchHits, hooks);
    snapshot({
      zh: i >= 0 ? `查找 ${input.searchHits} → 下标 ${i}` : `查找 ${input.searchHits} → 未命中`,
      en:
        i >= 0
          ? `Search ${input.searchHits} → index ${i}`
          : `Search ${input.searchHits} → not found`,
    });
  }
  if (input.searchMiss !== undefined) {
    const i = list.search(input.searchMiss, hooks);
    snapshot({
      zh: i >= 0 ? `查找 ${input.searchMiss} → 下标 ${i}` : `查找 ${input.searchMiss} → 未命中`,
      en:
        i >= 0
          ? `Search ${input.searchMiss} → index ${i}`
          : `Search ${input.searchMiss} → not found`,
    });
  }

  // 阶段 3：删除
  if (input.delete !== undefined) {
    const ok = list.delete(input.delete, hooks);
    snapshot({
      zh: ok ? `删除完成 ${input.delete}` : `${input.delete} 不存在，未删除`,
      en: ok ? `Deleted ${input.delete}` : `${input.delete} absent, not deleted`,
    });
  }

  // 终态
  const arr = list.toArray();
  rec
    .begin({
      zh: `完成，链表（head→tail）[${arr.join(' → ')}]，size=${list.size}`,
      en: `Done, list (head→tail) [${arr.join(' → ')}], size=${list.size}`,
    })
    .setBars(arr.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
