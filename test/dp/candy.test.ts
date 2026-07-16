import { test } from 'node:test';
import assert from 'node:assert/strict';
import { candy } from '../../src/algorithms/dp/candy/impl.ts';

// 校验：相邻评分更高者糖数严格更多；每人≥1；总数=返回值之和。
function check(ratings: number[], expectTotal: number): void {
  const c = candy(ratings);
  assert.equal(
    c.reduce((a, b) => a + b, 0),
    expectTotal,
  );
  for (const v of c) assert.ok(v >= 1, '每人至少 1 颗');
  for (let i = 1; i < ratings.length; i++) {
    if (ratings[i]! > ratings[i - 1]!) assert.ok(c[i]! > c[i - 1]!, `i=${i} 应比左多`);
    if (ratings[i]! < ratings[i - 1]!) assert.ok(c[i]! < c[i - 1]!, `i=${i} 应比左少`);
  }
}

test('candy 基本行为', () => {
  assert.deepEqual(candy([]), []);
  assert.deepEqual(candy([5]), [1]);
  assert.deepEqual(candy([3, 3]), [1, 1]); // 相等不要求更多
});

test('candy 经典用例', () => {
  check([1, 0, 2], 5); // [2,1,2]
  check([1, 2, 2], 4); // [1,2,1]（相等不强制）
  check([1, 0, 2, 5, 3, 2, 1, 4], 17); // [2,1,2,4,3,2,1,2]
});

test('candy 单调上升', () => {
  check([1, 2, 3, 4, 5], 15); // [1,2,3,4,5]
});

test('candy 钩子被调用', () => {
  let left = 0;
  let right = 0;
  let done = -1;
  candy([1, 0, 2], {
    onLeftPass: () => left++,
    onRightPass: () => right++,
    onDone: (t) => {
      done = t;
    },
  });
  assert.ok(left > 0, '左扫应触发');
  assert.ok(right > 0, '右扫应触发');
  assert.equal(done, 5);
});
