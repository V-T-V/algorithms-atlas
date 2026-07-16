import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyWiggle2 } from '../../src/algorithms/greedy/greedy-wiggle-2/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-wiggle-2/trace.ts';

test('wiggle [1,7,4,9,2,5] = 6', () => {
  assert.equal(greedyWiggle2([1, 7, 4, 9, 2, 5]).length, 6);
});

test('wiggle 全相同 = 1', () => {
  assert.equal(greedyWiggle2([5, 5, 5, 5]).length, 1);
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
