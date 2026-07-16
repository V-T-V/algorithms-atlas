import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyQueue2, type Person } from '../../src/algorithms/greedy/greedy-queue-2/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-queue-2/trace.ts';

test('队列重建经典示例', () => {
  const P: Person[] = [
    { h: 7, k: 0 },
    { h: 4, k: 4 },
    { h: 7, k: 1 },
    { h: 5, k: 0 },
    { h: 6, k: 1 },
    { h: 5, k: 2 },
  ];
  const r = greedyQueue2(P);
  assert.deepEqual(
    r.queue.map((p) => [p.h, p.k]),
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

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
