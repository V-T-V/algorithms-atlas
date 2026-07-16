import { test } from 'node:test';
import assert from 'node:assert/strict';
import { queueRecon } from '../../src/algorithms/greedy/queue-recon/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/greedy/queue-recon/trace.ts';

test('queueRecon 经典示例', () => {
  const input = [
    { h: 7, k: 0 },
    { h: 4, k: 4 },
    { h: 7, k: 1 },
    { h: 5, k: 0 },
    { h: 6, k: 1 },
    { h: 5, k: 2 },
  ];
  const { queue } = queueRecon(input);
  assert.deepEqual(
    queue.map((p) => [p.h, p.k]),
    [
      [5, 0],
      [7, 0],
      [5, 2],
      [6, 1],
      [4, 4],
      [7, 1],
    ],
  );
});

test('queueRecon 结果满足 k 约束', () => {
  const input = [
    { h: 9, k: 0 },
    { h: 1, k: 1 },
  ];
  const { queue } = queueRecon(input);
  for (let i = 0; i < queue.length; i++) {
    let cnt = 0;
    for (let j = 0; j < i; j++) if (queue[j]!.h >= queue[i]!.h) cnt++;
    assert.equal(cnt, queue[i]!.k);
  }
});

test('buildTrace 含队列', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
});
