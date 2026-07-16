import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscIsPerfectSquare } from '../../src/algorithms/misc/misc-is-perfect-square/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-is-perfect-square/trace.ts';
test('16 是完全平方', () => {
  assert.equal(miscIsPerfectSquare(16), true);
});
test('14 不是完全平方', () => {
  assert.equal(miscIsPerfectSquare(14), false);
});
test('1 是完全平方', () => {
  assert.equal(miscIsPerfectSquare(1), true);
});
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
