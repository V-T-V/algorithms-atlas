import { test } from 'node:test';
import assert from 'node:assert/strict';
import { topKQuick, quickselect } from '../../src/algorithms/selection/sel-top-k-quick/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-top-k-quick/trace.ts';

test('sel-top-k-quick 前三大集合正确', () => {
  const r = topKQuick([3, 1, 4, 1, 5, 9, 2, 6], 3);
  assert.deepEqual(
    [...r].sort((a, b) => b - a),
    [9, 6, 5],
  );
});

test('sel-top-k-quick 大小正确', () => {
  assert.equal(topKQuick([1, 2, 3, 4, 5], 3).length, 3);
});

test('sel-top-k-quick k=0 空', () => {
  assert.deepEqual(topKQuick([1, 2, 3], 0), []);
});

test('sel-top-k-quick quickselect 放置正确', () => {
  const a = [3, 1, 2];
  quickselect(a, 0); // 第 0 小到位置 0
  assert.equal(a[0], 1);
});

test('sel-top-k-quick trace', () => {
  assert.ok(buildTrace().length > 2);
});
