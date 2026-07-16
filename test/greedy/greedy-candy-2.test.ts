import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyCandy2 } from '../../src/algorithms/greedy/greedy-candy-2/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-candy-2/trace.ts';

test('candy [1,0,2] = 5', () => {
  assert.equal(greedyCandy2([1, 0, 2]).total, 5);
});

test('candy [1,2,2] = 4', () => {
  assert.equal(greedyCandy2([1, 2, 2]).total, 4);
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
