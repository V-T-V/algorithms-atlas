import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyMonotone2 } from '../../src/algorithms/greedy/greedy-monotone-2/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-monotone-2/trace.ts';

test('monotone 332 → 299', () => {
  assert.equal(greedyMonotone2(332).value, 299);
});

test('monotone 1234 → 1234', () => {
  assert.equal(greedyMonotone2(1234).value, 1234);
});

test('monotone 10 → 9', () => {
  assert.equal(greedyMonotone2(10).value, 9);
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
