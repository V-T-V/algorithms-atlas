import { test } from 'node:test';
import assert from 'node:assert/strict';
import { weightedFairQueueing } from '../../src/algorithms/scheduling/weighted-fair-queueing/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/weighted-fair-queueing/trace.ts';

test('weightedFairQueueing 高权重流先完成', () => {
  const r = weightedFairQueueing(
    [
      { id: 'a1', flow: 'A', length: 2 },
      { id: 'a2', flow: 'A', length: 2 },
      { id: 'b1', flow: 'B', length: 2 },
      { id: 'b2', flow: 'B', length: 2 },
    ],
    [
      { flow: 'A', weight: 2 },
      { flow: 'B', weight: 1 },
    ],
  );
  // 第一包：A 的 FN=1，B 的 FN=2 → a1 先
  assert.equal(r.schedule[0]!.id, 'a1');
  assert.equal(r.schedule[1]!.id, 'b1');
});

test('weightedFairQueueing 字节按权重比例', () => {
  const r = weightedFairQueueing(
    [
      { id: 'a1', flow: 'A', length: 10 },
      { id: 'b1', flow: 'B', length: 10 },
    ],
    [
      { flow: 'A', weight: 3 },
      { flow: 'B', weight: 1 },
    ],
  );
  assert.equal(r.flowBytes['A'], 10);
  assert.equal(r.flowBytes['B'], 10);
  assert.equal(r.totalTime, 20);
});

test('weightedFairQueueing 缺省权重为 1', () => {
  const r = weightedFairQueueing(
    [
      { id: 'x1', flow: 'X', length: 4 },
      { id: 'x2', flow: 'X', length: 4 },
    ],
    [],
  );
  assert.equal(r.schedule.length, 2);
  // FN: x1=4, x2=8
  assert.equal(r.schedule[0]!.id, 'x1');
});

test('weightedFairQueueing 钩子触发', () => {
  let sends = 0;
  let computes = 0;
  weightedFairQueueing(
    [
      { id: 'a1', flow: 'A', length: 2 },
      { id: 'b1', flow: 'B', length: 2 },
    ],
    [
      { flow: 'A', weight: 1 },
      { flow: 'B', weight: 1 },
    ],
    {
      onSend: () => sends++,
      onComputeFinish: () => computes++,
    },
  );
  assert.equal(sends, 2);
  assert.equal(computes, 2);
});

test('weightedFairQueueing 空输入', () => {
  const r = weightedFairQueueing([], []);
  assert.deepEqual(r.schedule, []);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
});
