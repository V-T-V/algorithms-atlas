// =============================================================================
// 双向链表 · 录制帧序列
// 用 setBars 展示节点序列（head→tail）。当前比较节点标 'compare'，
// 命中标 'pivot'，新增端点标 'final'，待删/已删标 'swap'。
// 用 setAux 展示 size / head / tail 值。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { DoublyLinkedList, type DoublyLinkedListHooks } from './impl.ts';

/** 演示：交替头/尾插入，查找命中，再删除一个端点节点。 */
export const DEFAULT_INPUT = {
  ops: [
    { side: 'tail', value: 10 },
    { side: 'tail', value: 20 },
    { side: 'head', value: 5 },
    { side: 'tail', value: 30 },
    { side: 'head', value: 1 },
  ] as Array<{ side: 'head' | 'tail'; value: number }>,
  search: 20,
  deleteValue: 5,
};

/** 录制演示帧序列。 */
export function buildTrace(
  input: {
    ops?: Array<{ side: 'head' | 'tail'; value: number }>;
    search?: number;
    deleteValue?: number;
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const list = new DoublyLinkedList();

  let compareIdx = -1;
  let hitIdx = -1;
  let newSide: 'head' | 'tail' | null = null;
  let delIdx = -1;

  const snapshot = (note: { zh: string; en: string }): void => {
    const arr = list.toArray();
    const roles: Record<number, BarRole> = {};
    for (let i = 0; i < arr.length; i++) {
      if (i === delIdx) roles[i] = 'swap';
      else if (i === hitIdx) roles[i] = 'pivot';
      else if (i === compareIdx) roles[i] = 'compare';
      else if (newSide === 'head' && i === 0) roles[i] = 'final';
      else if (newSide === 'tail' && i === arr.length - 1) roles[i] = 'final';
      else roles[i] = 'sorted';
    }
    rec
      .begin(note)
      .setBars(rec.barsFrom(arr, roles))
      .setAux([
        { label: 'size', value: String(list.size), role: 'final' },
        { label: 'head', value: arr.length ? String(arr[0]!) : 'null', role: 'pivot' },
        {
          label: 'tail',
          value: arr.length ? String(arr[arr.length - 1]!) : 'null',
          role: 'frontier',
        },
      ])
      .commit();
    compareIdx = hitIdx = delIdx = -1;
    newSide = null;
  };

  snapshot({ zh: '空双向链表', en: 'Empty doubly linked list' });

  const hooks: DoublyLinkedListHooks = {
    onInsert: (side, value) => {
      newSide = side;
      snapshot({
        zh: `${side === 'head' ? '头插' : '尾插'} ${value}`,
        en: `${side === 'head' ? 'Head insert' : 'Tail insert'} ${value}`,
      });
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
        zh: `删除 ${value}（prev↔next 跳过它）`,
        en: `Delete ${value} (prev↔next skip it)`,
      });
    },
  };

  for (const op of input.ops ?? DEFAULT_INPUT.ops) {
    if (op.side === 'head') list.insertHead(op.value, hooks);
    else list.insertTail(op.value, hooks);
  }

  if (input.search !== undefined) {
    const i = list.search(input.search, hooks);
    snapshot({
      zh: i >= 0 ? `查找 ${input.search} → 下标 ${i}` : `查找 ${input.search} → 未命中`,
      en: i >= 0 ? `Search ${input.search} → index ${i}` : `Search ${input.search} → not found`,
    });
  }

  if (input.deleteValue !== undefined) {
    const ok = list.delete(input.deleteValue, hooks);
    snapshot({
      zh: ok ? `删除完成 ${input.deleteValue}` : `${input.deleteValue} 不存在`,
      en: ok ? `Deleted ${input.deleteValue}` : `${input.deleteValue} absent`,
    });
  }

  // 终态
  const arr = list.toArray();
  const rev = list.toArrayReverse();
  rec
    .begin({
      zh: `完成，正向 [${arr.join(' ↔ ')}]，反向 [${rev.join(' ↔ ')}]`,
      en: `Done, forward [${arr.join(' ↔ ')}], reverse [${rev.join(' ↔ ')}]`,
    })
    .setBars(arr.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
