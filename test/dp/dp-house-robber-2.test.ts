import { test } from 'node:test';
import assert from 'node:assert/strict';
import { houseRobber2 } from '../../src/algorithms/dp/dp-house-robber-2/impl.ts';

test('house-robber-2 LeetCode 213 例', () => {
  assert.equal(houseRobber2([2, 3, 2]), 3);
  assert.equal(houseRobber2([1, 2, 3, 1]), 4);
  assert.equal(houseRobber2([1, 2, 3]), 3);
});

test('house-robber-2 单屋', () => {
  assert.equal(houseRobber2([5]), 5);
});

test('house-robber-2 两屋取大', () => {
  assert.equal(houseRobber2([3, 5]), 5);
  assert.equal(houseRobber2([7, 2]), 7);
});

test('house-robber-2 空数组', () => {
  assert.equal(houseRobber2([]), 0);
});

test('house-robber-2 全相同', () => {
  // 环形 n 个 1，答案 = n-1（不能抢首+尾）
  assert.equal(houseRobber2([1, 1, 1, 1]), 2);
});

test('house-robber-2 钩子', () => {
  let ranges = 0;
  houseRobber2([1, 2, 3, 1], { onRange: () => ranges++ });
  assert.equal(ranges, 2);
});
