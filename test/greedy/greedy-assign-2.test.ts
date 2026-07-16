import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyAssign2 } from '../../src/algorithms/greedy/greedy-assign-2/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-assign-2/trace.ts';

test('assign cookies [1,2,3] / [1,1] = 1', () => {
  assert.equal(greedyAssign2([1, 2, 3], [1, 1]).count, 1);
});

test('assign cookies [1,2] / [1,2,3] = 2', () => {
  assert.equal(greedyAssign2([1, 2], [1, 2, 3]).count, 2);
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
