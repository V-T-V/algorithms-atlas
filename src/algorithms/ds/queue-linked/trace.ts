// =============================================================================
// 链式队列 · 录制帧序列
// 用 setBars 展示队首→队尾 节点序列：front 标 'pivot'，rear 标 'frontier'，
// 入队新节点标 'final'，出队节点标 'swap'。
// 用 setAux 展示 size / front / rear 值。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { QueueLinked, type QueueLinkedHooks } from './impl.ts';

/** 演示：入队若干 → 出队若干 → 再入队，体现 front/rear 持续推进。 */
export const DEFAULT_INPUT = {
  enqueue1: [10, 20, 30],
  dequeues: 2,
  enqueue2: [40, 50],
};

/** 录制演示帧序列。 */
export function buildTrace(
  input: {
    enqueue1?: readonly number[];
    dequeues?: number;
    enqueue2?: readonly number[];
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const q = new QueueLinked();

  let pushVal: number | null = null;
  let popVal: number | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    const arr = q.toArray(); // front→rear
    const roles: Record<number, BarRole> = {};
    for (let i = 0; i < arr.length; i++) {
      if (i === arr.length - 1 && pushVal !== null)
        roles[i] = 'final'; // 新 rear
      else if (i === 0)
        roles[i] = 'pivot'; // front
      else roles[i] = 'sorted';
    }
    if (popVal !== null && arr.length === 0) {
      // 出队后为空，用 aux 说明
    }
    rec
      .begin(note)
      .setBars(rec.barsFrom(arr, roles))
      .setAux([
        { label: 'size', value: String(q.size), role: 'final' },
        { label: 'front', value: arr.length ? String(arr[0]!) : 'null', role: 'pivot' },
        {
          label: 'rear',
          value: arr.length ? String(arr[arr.length - 1]!) : 'null',
          role: 'frontier',
        },
      ])
      .commit();
    pushVal = popVal = null;
  };

  snapshot({ zh: '空队列（front=rear=null）', en: 'Empty queue (front=rear=null)' });

  const hooks: QueueLinkedHooks = {
    onEnqueue: (value) => {
      pushVal = value;
      snapshot({
        zh: `入队 ${value}（接在 rear 之后）`,
        en: `Enqueue ${value} (append after rear)`,
      });
    },
    onDequeue: (value) => {
      popVal = value;
      snapshot({ zh: `出队 ${value}（取走 front）`, en: `Dequeue ${value} (remove front)` });
    },
  };

  for (const v of input.enqueue1 ?? []) q.enqueue(v, hooks);
  for (let k = 0; k < (input.dequeues ?? 0); k++) q.dequeue(hooks);
  for (const v of input.enqueue2 ?? []) q.enqueue(v, hooks);

  // 终态
  const arr = q.toArray();
  rec
    .begin({
      zh: `完成，队内 [${arr.join(', ')}]（front→rear）`,
      en: `Done, queue [${arr.join(', ')}] (front→rear)`,
    })
    .setBars(arr.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
