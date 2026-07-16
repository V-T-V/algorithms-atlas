// =============================================================================
// 可降键优先队列 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { IndexedMinHeap, type IndexedHeapHooks } from './impl.ts';

export const DEFAULT_INPUT: {
  inserts: Array<[number, number]>;
  decreases: Array<[number, number]>;
} = {
  inserts: [
    [0, 50],
    [1, 30],
    [2, 40],
    [3, 10],
    [4, 20],
  ],
  decreases: [[0, 5]],
};

export function buildTrace(
  input: {
    inserts: Array<[number, number]>;
    decreases: Array<[number, number]>;
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { inserts, decreases } = input;

  rec
    .begin({
      zh: `索引最小堆：插入 ${inserts.length} 项`,
      en: `Indexed min-heap: insert ${inserts.length}`,
    })
    .setAux([{ label: '操作', value: 'insert', role: 'frontier' }])
    .commit();

  const hooks: IndexedHeapHooks = {
    onPush: (id, prio) => {
      rec
        .begin({ zh: `push(id=${id}, prio=${prio})`, en: `push(id=${id}, prio=${prio})` })
        .setAux([{ label: 'push', value: `${id}:${prio}`, role: 'compare' }])
        .commit();
    },
    onSiftUp: (pos, id) => {
      rec
        .begin({ zh: `上浮：id=${id} 到位置 ${pos}`, en: `Sift up: id=${id} to pos ${pos}` })
        .setAux([{ label: '上浮', value: `id${id}@${pos}`, role: 'frontier' }])
        .commit();
    },
    onDecreaseKey: (id, oldP, newP) => {
      rec
        .begin({
          zh: `decreaseKey(id=${id}): ${oldP} → ${newP}`,
          en: `decreaseKey(id=${id}): ${oldP} → ${newP}`,
        })
        .setAux([{ label: '降键', value: `${id}:${oldP}→${newP}`, role: 'warn' }])
        .commit();
    },
  };

  const h = new IndexedMinHeap(hooks);
  for (const [id, prio] of inserts) h.push(id, prio);
  for (const [id, prio] of decreases) h.decreaseKey(id, prio);

  const order: Array<[number, number]> = [];
  while (h.size > 0) {
    const e = h.pop()!;
    order.push([e.id, e.prio]);
  }
  rec
    .begin({
      zh: `全部弹出顺序：${order.map(([i, p]) => `${i}:${p}`).join(', ')}`,
      en: `Pop order: ${order.map(([i, p]) => `${i}:${p}`).join(', ')}`,
    })
    .setAux([{ label: '顺序', value: order.map(([i]) => String(i)).join(','), role: 'final' }])
    .commit();

  return rec.build();
}
