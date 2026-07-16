import { test } from 'node:test';
import assert from 'node:assert/strict';
import { depthSum, maxDepth } from '../../src/algorithms/recursion/rec-nested-list-weight/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-nested-list-weight/trace.ts';

test('rec-nested-list-weight 经典用例', () => {
  assert.equal(depthSum([[1, 1], 2, [1, 1]]), 10);
  assert.equal(depthSum([1, [4, [6]]]), 27); // 1·1 + 4·2 + 6·3
});

test('rec-nested-list-weight 平铺', () => {
  assert.equal(depthSum([1, 2, 3]), 6);
});

test('rec-nested-list-weight 深嵌套', () => {
  assert.equal(depthSum([[[[5]]]]), 20); // 5·4
});

test('rec-nested-list-weight maxDepth', () => {
  assert.equal(maxDepth([1, [2, [3]]]), 3);
  assert.equal(maxDepth([1, 2, 3]), 1);
});

test('rec-nested-list-weight trace', () => {
  assert.ok(buildTrace().length > 2);
});
