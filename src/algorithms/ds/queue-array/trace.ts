// =============================================================================
// 数组队列 · 录制帧序列
// 用 setBars 展示队列内容（队首标 'pivot'，入队位标 'final'，
// 出队位标 'swap'，被搬移元素标 'compare'）。
// 用 setAux 展示 size / capacity / front 值。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { QueueArray, type QueueArrayHooks } from './impl.ts';

/** 演示：入队若干，再出队（触发整体前移）。 */
export const DEFAULT_INPUT = {
  enqueue: [1, 2, 3, 4, 5],
  dequeues: 3,
};

/** 录制演示帧序列。 */
export function buildTrace(
  input: { enqueue: readonly number[]; dequeues?: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const q = new QueueArray(8);

  let frontIdx = -1;
  let pushIdx = -1;
  let popIdx = -1;
  let shiftRange = false; // compact 期间高亮整段

  const snapshot = (note: { zh: string; en: string }): void => {
    const arr = q.toArray();
    const roles: Record<number, BarRole> = {};
    for (let i = 0; i < arr.length; i++) {
      if (shiftRange) roles[i] = 'compare';
      else if (i === popIdx) roles[i] = 'swap';
      else if (i === pushIdx) roles[i] = 'final';
      else if (i === frontIdx || i === 0) roles[i] = 'pivot';
      else roles[i] = 'sorted';
    }
    rec
      .begin(note)
      .setBars(rec.barsFrom(arr, roles))
      .setAux([
        { label: 'size', value: String(q.size), role: 'final' },
        { label: 'capacity', value: String(q.capacity), role: 'compare' },
        { label: 'front', value: arr.length ? String(arr[0]!) : '∅', role: 'pivot' },
      ])
      .commit();
    frontIdx = pushIdx = popIdx = -1;
    shiftRange = false;
  };

  snapshot({ zh: '空队列', en: 'Empty queue' });

  const hooks: QueueArrayHooks = {
    onEnqueue: (sz, value) => {
      pushIdx = sz - 1;
      void value;
      snapshot({ zh: `入队 ${value}（队尾）`, en: `Enqueue ${value} (rear)` });
    },
    onDequeue: (sz, value) => {
      popIdx = 0;
      void sz;
      snapshot({ zh: `出队 ${value}（队首 data[0]）`, en: `Dequeue ${value} (front data[0])` });
    },
    onCompact: (moved) => {
      shiftRange = true;
      snapshot({
        zh: `剩余 ${moved} 个元素整体前移一位`,
        en: `Shift remaining ${moved} elements one slot left`,
      });
    },
  };

  for (const v of input.enqueue) q.enqueue(v, hooks);

  const out: number[] = [];
  for (let k = 0; k < (input.dequeues ?? 0); k++) {
    const v = q.dequeue(hooks);
    if (v !== undefined) out.push(v);
  }

  // 终态
  const arr = q.toArray();
  rec
    .begin({
      zh: `完成，队内 [${arr.join(', ')}]，出队序列 [${out.join(', ')}]`,
      en: `Done, queue [${arr.join(', ')}], dequeued [${out.join(', ')}]`,
    })
    .setBars(arr.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
