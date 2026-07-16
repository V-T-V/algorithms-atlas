import { test } from 'node:test';
import assert from 'node:assert/strict';
import { medianOfTwoSorted } from '../../src/algorithms/selection/median-of-two-sorted/impl.ts';

test('medianOfTwoSorted 奇数总长', () => {
  // 合并 [1,3] [2] => [1,2,3]，中位数 2
  assert.equal(medianOfTwoSorted([1, 3], [2]), 2);
});

test('medianOfTwoSorted 偶数总长', () => {
  // 合并 [1,2] [3,4] => [1,2,3,4]，中位数 (2+3)/2=2.5
  assert.equal(medianOfTwoSorted([1, 2], [3, 4]), 2.5);
});

test('medianOfTwoSorted 经典用例', () => {
  // 合并 [1,3,5,7] [2,4,6,8,9] => [1..9]，长度 9，中位数是第 5 小 = 5
  assert.equal(medianOfTwoSorted([1, 3, 5, 7], [2, 4, 6, 8, 9]), 5);
});

test('medianOfTwoSorted 一个为空', () => {
  assert.equal(medianOfTwoSorted([], [1, 2, 3]), 2);
  assert.equal(medianOfTwoSorted([1, 2, 3, 4], []), 2.5);
});

test('medianOfTwoSorted 不相交区间', () => {
  // [1,2,3] [4,5,6,7] => [1..7]，中位数 4
  assert.equal(medianOfTwoSorted([1, 2, 3], [4, 5, 6, 7]), 4);
});

test('medianOfTwoSorted 交换参数等价', () => {
  const a = [1, 3, 5];
  const b = [2, 4, 6, 8];
  assert.equal(medianOfTwoSorted(a, b), medianOfTwoSorted(b, a));
});

test('medianOfTwoSorted 钩子被调用', () => {
  let parts = 0;
  let done = -1;
  medianOfTwoSorted([1, 3], [2], {
    onPartition: () => parts++,
    onDone: (m) => (done = m),
  });
  assert.ok(parts > 0, '应有划分事件');
  assert.equal(done, 2);
});

test('medianOfTwoSorted 与朴素合并一致（随机）', () => {
  const a = [-5, 0, 4, 10, 17];
  const b = [-1, 3, 6, 9, 12, 20];
  const merged = [...a, ...b].sort((x, y) => x - y);
  const mid = merged.length;
  const expected =
    mid % 2 === 1 ? merged[(mid - 1) / 2]! : (merged[mid / 2 - 1]! + merged[mid / 2]!) / 2;
  assert.equal(medianOfTwoSorted(a, b), expected);
});
