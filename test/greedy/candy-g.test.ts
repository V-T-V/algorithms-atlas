import { test } from 'node:test';
import assert from 'node:assert/strict';
import { candy, type CandyGHooks } from '../../src/algorithms/greedy/candy-g/impl.ts';

test('candy-g [1,0,2] = 5', () => {
  // LeetCode 示例：2,1,2
  const r = candy([1, 0, 2]);
  assert.equal(r.total, 5);
  assert.deepEqual(r.candies, [2, 1, 2]);
});

test('candy-g [1,2,2] = 4', () => {
  // LeetCode 示例：1,2,1（相等不要求更多）
  const r = candy([1, 2, 2]);
  assert.equal(r.total, 4);
  assert.deepEqual(r.candies, [1, 2, 1]);
});

test('candy-g 单元素 = 1', () => {
  assert.equal(candy([5]).total, 1);
});

test('candy-g 空数组 = 0', () => {
  assert.equal(candy([]).total, 0);
});

test('candy-g 严格递增 = 1+2+...+n', () => {
  const r = candy([1, 2, 3, 4, 5]);
  assert.equal(r.total, 15);
  assert.deepEqual(r.candies, [1, 2, 3, 4, 5]);
});

test('candy-g 严格递减 = n+...+1', () => {
  const r = candy([5, 4, 3, 2, 1]);
  assert.equal(r.total, 15);
  assert.deepEqual(r.candies, [5, 4, 3, 2, 1]);
});

test('candy-g 满足相邻规则', () => {
  const ratings = [1, 3, 2, 2, 1, 4, 5];
  const r = candy(ratings);
  for (let i = 0; i < ratings.length - 1; i++) {
    if (ratings[i]! < ratings[i + 1]!) {
      assert.ok(r.candies[i]! < r.candies[i + 1]!, `位置 ${i} 评分高者应糖更多`);
    } else if (ratings[i]! > ratings[i + 1]!) {
      assert.ok(r.candies[i]! > r.candies[i + 1]!, `位置 ${i} 评分高者应糖更多`);
    }
  }
});

test('candy-g 钩子被调用', () => {
  let lefts = 0;
  let rights = 0;
  const hooks: CandyGHooks = {
    onLeftPass: () => lefts++,
    onRightPass: () => rights++,
  };
  candy([1, 0, 2], hooks);
  assert.ok(lefts > 0);
  assert.ok(rights > 0);
});

test('candy-g [1,2,87,87,87,2,1] = 13', () => {
  // 经典例子：1,2,3,1,3,2,1
  const r = candy([1, 2, 87, 87, 87, 2, 1]);
  assert.equal(r.total, 13);
});
