// =============================================================================
// 双端队列 · 录制帧序列
// 用 setArray 展示环形缓冲区，pointers 标 front/rear；setAux 展示逻辑序列。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Deque, type DequeHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  capacity: 8,
  ops: [
    { side: 'back', op: 'push', value: 1 },
    { side: 'back', op: 'push', value: 2 },
    { side: 'back', op: 'push', value: 3 },
    { side: 'front', op: 'push', value: 0 },
    { side: 'front', op: 'pop' },
    { side: 'back', op: 'pop' },
    { side: 'front', op: 'push', value: 9 },
    { side: 'back', op: 'push', value: 4 },
  ] as const,
};

/** 录制演示帧序列。 */
export function buildTrace(
  input: {
    capacity: number;
    ops: ReadonlyArray<{ side: 'front' | 'back'; op: 'push' | 'pop'; value?: number }>;
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const q = new Deque(input.capacity);

  const snapshot = (
    note: { zh: string; en: string },
    activeIdx: number,
    activeRole: BarRole,
  ): void => {
    const arr = q.toArray();
    const roles: BarRole[] = arr.map(() => 'default');
    // 标记已占用槽位为 frontier
    for (let k = 0; k < q.size; k++) {
      const idx = (q.front + k) % input.capacity;
      roles[idx] = 'frontier';
    }
    if (activeIdx >= 0) roles[activeIdx] = activeRole;
    const pointers: Array<{ index: number; label: string }> = [];
    if (!q.isEmpty()) {
      pointers.push({ index: q.front, label: 'front' });
      pointers.push({ index: (q.rear - 1 + input.capacity) % input.capacity, label: 'rear' });
    } else {
      pointers.push({ index: q.rear, label: 'front=rear' });
    }
    rec
      .begin(note)
      .setArray(arr, roles, pointers)
      .setAux([
        { label: '逻辑序列 (front→back)', value: `[${q.toSequence().join(', ')}]`, role: 'final' },
        { label: 'size / capacity', value: `${q.size} / ${input.capacity}` },
      ])
      .commit();
  };

  snapshot({ zh: '空双端队列', en: 'Empty deque' }, -1, 'default');

  const hooks: DequeHooks = {
    onPushFront: (idx, value) => {
      snapshot(
        { zh: `队首入队 ${value}（写入下标 ${idx}）`, en: `pushFront ${value} (idx ${idx})` },
        idx,
        'swap',
      );
    },
    onPushBack: (idx, value) => {
      snapshot(
        { zh: `队尾入队 ${value}（写入下标 ${idx}）`, en: `pushBack ${value} (idx ${idx})` },
        idx,
        'swap',
      );
    },
    onPopFront: (idx, value) => {
      snapshot(
        { zh: `队首出队 ${value}（取自下标 ${idx}）`, en: `popFront ${value} (idx ${idx})` },
        idx,
        'compare',
      );
    },
    onPopBack: (idx, value) => {
      snapshot(
        { zh: `队尾出队 ${value}（取自下标 ${idx}）`, en: `popBack ${value} (idx ${idx})` },
        idx,
        'compare',
      );
    },
  };

  for (const o of input.ops) {
    if (o.op === 'push') {
      if (o.side === 'front') q.pushFront(o.value ?? 0, hooks);
      else q.pushBack(o.value ?? 0, hooks);
    } else {
      if (o.side === 'front') q.popFront(hooks);
      else q.popBack(hooks);
    }
  }

  // 终态
  const seq = q.toSequence();
  rec
    .begin({
      zh: `完成；逻辑序列：[${seq.join(', ')}]`,
      en: `Done; sequence: [${seq.join(', ')}]`,
    })
    .setArray(
      q.toArray(),
      q.toArray().map((_, i) => {
        let used = false;
        for (let k = 0; k < q.size; k++) if ((q.front + k) % input.capacity === i) used = true;
        return used ? ('final' as BarRole) : ('default' as BarRole);
      }),
      q.isEmpty()
        ? [{ index: q.rear, label: 'front=rear' }]
        : [
            { index: q.front, label: 'front' },
            { index: (q.rear - 1 + input.capacity) % input.capacity, label: 'rear' },
          ],
    )
    .setAux([
      { label: '逻辑序列 (front→back)', value: `[${seq.join(', ')}]`, role: 'final' },
      { label: 'size / capacity', value: `${q.size} / ${input.capacity}` },
    ])
    .commit();

  return rec.build();
}
