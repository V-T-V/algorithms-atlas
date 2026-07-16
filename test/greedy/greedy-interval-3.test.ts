import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyInterval3 } from '../../src/algorithms/greedy/greedy-interval-3/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-interval-3/trace.ts';

test('区间调度选最多不重叠', () => {
  const r = greedyInterval3([
    { s: 1, e: 3 },
    { s: 2, e: 5 },
    { s: 4, e: 6 },
    { s: 6, e: 8 },
    { s: 5, e: 9 },
  ]);
  assert.equal(r.count, 3);
});

test('空区间', () => {
  assert.equal(greedyInterval3([]).count, 0);
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
