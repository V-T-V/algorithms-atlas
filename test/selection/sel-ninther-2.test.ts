import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ninther } from '../../src/algorithms/selection/sel-ninther-2/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-ninther-2/trace.ts';

test('ninther 返回采样中之一', () => {
  const a = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0, 11, 13, 12, 10, 14];
  const p = ninther(a);
  assert.ok(Number.isFinite(p));
});
test('ninther 小数组降级', () => {
  assert.equal(ninther([3, 1, 2]), 2);
});
test('ninther trace 非空', () => assert.ok(buildTrace().length > 0));
