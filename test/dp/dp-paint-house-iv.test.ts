import { test } from 'node:test';
import assert from 'node:assert/strict';
import { paintHouseK } from '../../src/algorithms/dp/dp-paint-house-iv/impl.ts';

test('paint-house LeetCode 265 例', () => {
  // 0:色0(1) 1:色2(1) 2:色1(4) 3:色2(1) => 7
  assert.equal(
    paintHouseK([
      [1, 5, 3],
      [2, 3, 1],
      [8, 4, 1],
      [4, 2, 1],
    ]),
    7,
  );
});

test('paint-house 单栋', () => {
  assert.equal(paintHouseK([[1, 2, 3]]), 1);
});

test('paint-house 两栋三色', () => {
  assert.equal(
    paintHouseK([
      [1, 2],
      [3, 1],
    ]),
    2,
  );
});

test('paint-house 空矩阵', () => {
  assert.equal(paintHouseK([]), 0);
});

test('paint-house 三栋两色', () => {
  assert.equal(
    paintHouseK([
      [1, 2],
      [4, 1],
      [1, 3],
    ]),
    3,
  );
});
