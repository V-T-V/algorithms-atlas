import { test } from 'node:test';
import assert from 'node:assert/strict';
import { introselect } from '../../src/algorithms/selection/sel-introselect-full-2/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-introselect-full-2/trace.ts';

test('introselect 第 k 小', () => {
  const a = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  for (let k = 0; k < 10; k++) assert.equal(introselect(a, k, 3), k);
});
test('introselect 已排序数据最坏情况仍正确', () => {
  const a = Array.from({ length: 50 }, (_, i) => i);
  for (let k = 0; k < 50; k += 7) assert.equal(introselect(a, k, 1), k);
});
test('introselect trace 非空', () => assert.ok(buildTrace().length > 0));
