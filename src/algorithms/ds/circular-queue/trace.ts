// =============================================================================
// 循环队列 · 录制帧序列
// 通过 CircularQueue 的钩子，把执行过程录成 Frame[]。
// 用 setArray 展示定长环形数组，pointers 标 front / rear。
// 入队的下标标 'final'，出队的下标标 'swap'，满/空用 note 提示。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { CircularQueue, circularQueue, type CircularQueueHooks } from './impl.ts';

/** 演示：一批入队 → 出队若干 → 再入队（触发环绕 wrap-around）。 */
export const DEFAULT_INPUT = {
  capacity: 5,
  ops: [
    10, // enq
    20, // enq
    30, // enq
    null, // deq → 10
    null, // deq → 20
    40, // enq（开始环绕）
    50, // enq
    60, // enq（队满前一个）
    null, // deq → 30
  ] as ReadonlyArray<number | null>,
};

/** 录制演示帧序列。 */
export function buildTrace(
  input: { capacity: number; ops: ReadonlyArray<number | null> } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const q = new CircularQueue(input.capacity);

  const hotFront = false;
  const hotRear = false;
  let lastOp: { kind: 'enqueue' | 'dequeue'; idx: number; value: number } | null = null;

  /** 渲染：values 来自底层定长数组；占位（空槽）用 0；指针标 front/rear。 */
  const render = (note: { zh: string; en: string }): void => {
    const data = q.toArray();
    const roles: BarRole[] = data.map((_, i) => {
      // 判断 i 是否在队内（环形区间 [front, rear)）
      const inQueue = isInQueue(i, q.front, q.rear, q.size, input.capacity);
      if (!inQueue) return 'default';
      if (lastOp && lastOp.idx === i) {
        return lastOp.kind === 'enqueue' ? 'final' : 'swap';
      }
      return 'compare';
    });
    const pointers: Array<{ index: number; label: string }> = [];
    if (!q.isEmpty()) pointers.push({ index: q.front, label: 'front' });
    pointers.push({ index: q.rear, label: 'rear' });
    if (hotFront) {
      // 重复添加无害；避免重复，直接覆盖
    }
    rec
      .begin(note)
      .setArray(data, roles, pointers)
      .setAux([
        { label: 'size', value: String(q.size), role: 'final' },
        {
          label: '状态',
          value: q.isEmpty() ? '空' : q.isFull() ? '满' : '非空',
          role: q.isFull() ? 'warn' : 'default',
        },
      ])
      .commit();
  };

  /** 判断下标 i 是否落在环形队列的活跃区间。 */
  const isInQueue = (
    i: number,
    front: number,
    rear: number,
    count: number,
    cap: number,
  ): boolean => {
    if (count === 0) return false;
    // 活跃下标：front, front+1, ..., front+count-1（mod cap）
    for (let k = 0; k < count; k++) {
      if ((front + k) % cap === i) return true;
    }
    void rear;
    return false;
  };

  void hotFront;
  void hotRear;

  render({
    zh: `空队列（容量 ${input.capacity}）`,
    en: `Empty queue (capacity ${input.capacity})`,
  });

  const hooks: CircularQueueHooks = {
    onEnqueue: (rearIdx, value) => {
      lastOp = { kind: 'enqueue', idx: rearIdx, value };
    },
    onDequeue: (frontIdx, value) => {
      lastOp = { kind: 'dequeue', idx: frontIdx, value };
    },
    onState: () => {},
  };

  for (const op of input.ops) {
    lastOp = null;
    if (op === null) {
      const out = q.dequeue(hooks);
      if (out === undefined) {
        render({ zh: '出队失败：队空', en: 'Dequeue failed: empty' });
      } else {
        render({
          zh: `出队 ${out}（front → ${(q.front + input.capacity) % input.capacity} 之前）`,
          en: `Dequeue ${out} (front advances)`,
        });
      }
    } else {
      const ok = q.enqueue(op, hooks);
      if (!ok) {
        render({ zh: `入队 ${op} 失败：队满`, en: `Enqueue ${op} failed: full` });
      } else {
        const wrapped = q.rear === 0; // 刚环绕回 0
        render({
          zh: `入队 ${op}（写到下标 ${(q.rear - 1 + input.capacity) % input.capacity}）${wrapped ? '〔rear 环绕〕' : ''}`,
          en: `Enqueue ${op} (write idx ${(q.rear - 1 + input.capacity) % input.capacity})${wrapped ? ' [wrap]' : ''}`,
        });
      }
    }
  }

  // 终态
  lastOp = null;
  rec
    .begin({
      zh: `完成，队内序列：[${q.toSequence().join(', ')}]`,
      en: `Done, queue: [${q.toSequence().join(', ')}]`,
    })
    .setArray(
      q.toArray(),
      q
        .toArray()
        .map((_, i) =>
          isInQueue(i, q.front, q.rear, q.size, input.capacity) ? 'final' : 'default',
        ),
      q.isEmpty()
        ? [{ index: q.rear, label: 'rear' }]
        : [
            { index: q.front, label: 'front' },
            { index: q.rear, label: 'rear' },
          ],
    )
    .commit();

  return rec.build();
}

void circularQueue;
