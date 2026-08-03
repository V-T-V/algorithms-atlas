import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  fairQueue,
  type FqPacket,
  type FqWeight,
} from '../../src/algorithms/scheduling/sched-fair-queue-2/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/sched-fair-queue-2/trace.ts';

test('sched-fair-queue-2：等权时按 finish time 排序发送', () => {
  const packets: FqPacket[] = [
    { flow: 'A', seq: 0, arrival: 0, size: 2 },
    { flow: 'B', seq: 0, arrival: 0, size: 1 },
  ];
  const weights: FqWeight[] = [
    { flow: 'A', weight: 1 },
    { flow: 'B', weight: 1 },
  ];
  const { sendOrder, flowBytes } = fairQueue(packets, weights);
  // B 的 finish = 0 + 1/1 = 1；A 的 finish = 0 + 2/1 = 2，故 B 先发
  assert.equal(sendOrder[0]!.flow, 'B');
  assert.equal(sendOrder[1]!.flow, 'A');
  assert.equal(flowBytes.A, 2);
  assert.equal(flowBytes.B, 1);
});

test('sched-fair-queue-2：高权重流的 finish 更小（更早发送）', () => {
  const packets: FqPacket[] = [
    { flow: 'A', seq: 0, arrival: 0, size: 2 },
    { flow: 'B', seq: 0, arrival: 0, size: 2 },
  ];
  const weights: FqWeight[] = [
    { flow: 'A', weight: 1 },
    { flow: 'B', weight: 2 },
  ];
  const { sendOrder } = fairQueue(packets, weights);
  // A finish=2/1=2, B finish=2/2=1 → B 先
  assert.equal(sendOrder[0]!.flow, 'B');
  assert.equal(sendOrder[1]!.flow, 'A');
});

test('sched-fair-queue-2：同一流的后续包受 lastFinish 约束', () => {
  const packets: FqPacket[] = [
    { flow: 'A', seq: 0, arrival: 0, size: 3 },
    { flow: 'A', seq: 1, arrival: 0, size: 3 },
  ];
  const weights: FqWeight[] = [{ flow: 'A', weight: 1 }];
  const { sendOrder } = fairQueue(packets, weights);
  assert.equal(sendOrder[0]!.seq, 0);
  assert.equal(sendOrder[1]!.seq, 1);
});

test('sched-fair-queue-2：缺失权重视为 1（不抛错）', () => {
  const packets: FqPacket[] = [{ flow: 'X', seq: 0, arrival: 0, size: 1 }];
  const r = fairQueue(packets, []);
  assert.equal(r.sendOrder.length, 1);
  assert.equal(r.flowBytes.X, 1);
});

test('sched-fair-queue-2：空输入返回空', () => {
  const { sendOrder, flowBytes } = fairQueue([], []);
  assert.equal(sendOrder.length, 0);
  assert.deepEqual(flowBytes, {});
});

test('sched-fair-queue-2：钩子在发送时触发并给出单调非降 finish', () => {
  const packets: FqPacket[] = [
    { flow: 'A', seq: 0, arrival: 0, size: 1 },
    { flow: 'B', seq: 0, arrival: 0, size: 1 },
  ];
  const weights: FqWeight[] = [
    { flow: 'A', weight: 1 },
    { flow: 'B', weight: 1 },
  ];
  const seen: number[] = [];
  fairQueue(packets, weights, { onSend: (_pkt, finishTime) => seen.push(finishTime) });
  assert.equal(seen.length, 2);
  assert.ok(seen[1]! >= seen[0]!, 'finish 应单调非降');
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 2);
});
