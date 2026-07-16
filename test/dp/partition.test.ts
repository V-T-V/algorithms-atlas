import { test } from 'node:test';
import assert from 'node:assert/strict';
import { partition } from '../../src/algorithms/dp/partition/impl.ts';

test('partition 基本行为', () => {
  assert.equal(partition([]), true); // 两空集相等
  assert.equal(partition([1]), false); // 无法等分
  assert.equal(partition([2, 2]), true);
  assert.equal(partition([1, 2, 3]), true); // 总和 6 目标 3，{1,2}=3
});

test('partition 经典用例', () => {
  // LeetCode 416：[1,5,11,5] → 11 = 5+5+1，true
  assert.equal(partition([1, 5, 11, 5]), true);
  // [1,2,3,5] 总和 11 奇数 → false
  assert.equal(partition([1, 2, 3, 5]), false);
  // [1,2,3,4] 总和 10 目标 5，1+4=5 或 2+3=5 → true
  assert.equal(partition([1, 2, 3, 4]), true);
});

test('partition 奇数总和', () => {
  assert.equal(partition([1, 1, 1]), false); // 总和 3
  assert.equal(partition([100]), false);
});

test('partition 钩子被调用', () => {
  let items = 0;
  let fill = 0;
  let done: boolean | null = null;
  partition([1, 5, 11, 5], {
    onItem: () => items++,
    onFillCell: () => fill++,
    onDone: (ok) => {
      done = ok;
    },
  });
  assert.ok(items >= 1, '应触发 onItem');
  assert.ok(fill > 0, '应触发 onFillCell');
  assert.equal(done, true);
});
