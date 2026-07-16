import { test } from 'node:test';
import assert from 'node:assert/strict';
import { triangleMinPath } from '../../src/algorithms/dp/dp-min-path-sum-tri/impl.ts';

test('tri-path LeetCode 120 例', () => {
  // 2→3→5→1 = 11
  assert.equal(triangleMinPath([[2], [3, 4], [6, 5, 7], [4, 1, 8, 3]]), 11);
});

test('tri-path 单行', () => {
  assert.equal(triangleMinPath([[5]]), 5);
});

test('tri-path 两行', () => {
  assert.equal(triangleMinPath([[1], [2, 3]]), 3);
});

test('tri-path 空三角形', () => {
  assert.equal(triangleMinPath([]), 0);
});

test('tri-path 全负', () => {
  assert.equal(triangleMinPath([[-1], [-2, -3]]), -4);
});
