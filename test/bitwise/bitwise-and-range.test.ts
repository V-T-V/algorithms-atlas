import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  rangeBitwiseAnd,
  rangeBitwiseAndNaive,
} from '../../src/algorithms/bitwise/bitwise-and-range/impl.ts';

test('rangeBitwiseAnd 与朴素法一致', () => {
  for (let l = 0; l <= 40; l++) {
    for (let r = l; r <= 40; r++) {
      assert.equal(rangeBitwiseAnd(l, r), rangeBitwiseAndNaive(l, r), `[${l},${r}]`);
    }
  }
});

test('rangeBitwiseAnd 经典例子', () => {
  assert.equal(rangeBitwiseAnd(5, 7), 4);
  assert.equal(rangeBitwiseAnd(0, 1), 0);
  assert.equal(rangeBitwiseAnd(1, 2147483647), 0);
});

test('rangeBitwiseAnd 边界', () => {
  assert.equal(rangeBitwiseAnd(0, 0), 0);
  assert.equal(rangeBitwiseAnd(7, 7), 7);
  assert.equal(rangeBitwiseAnd(8, 10), 8);
});

test('rangeBitwiseAnd 拒绝非法区间', () => {
  assert.throws(() => rangeBitwiseAnd(-1, 5), RangeError);
  assert.throws(() => rangeBitwiseAnd(5, 3), RangeError);
});
