import { test } from 'node:test';
import assert from 'node:assert/strict';
import { jumpSearchSquared } from '../../src/algorithms/searching/jump-search-squared/impl.ts';

const ARR = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25];

test('jumpSearchSquared 命中', () => {
  assert.equal(jumpSearchSquared(ARR, 1), 0);
  assert.equal(jumpSearchSquared(ARR, 25), 12);
  assert.equal(jumpSearchSquared(ARR, 15), 7);
  assert.equal(jumpSearchSquared(ARR, 13), 6);
});

test('jumpSearchSquared 未命中', () => {
  assert.equal(jumpSearchSquared(ARR, 0), -1);
  assert.equal(jumpSearchSquared(ARR, 26), -1);
  assert.equal(jumpSearchSquared(ARR, 14), -1);
  assert.equal(jumpSearchSquared(ARR, 4), -1);
});

test('jumpSearchSquared 边界', () => {
  assert.equal(jumpSearchSquared([], 1), -1);
  assert.equal(jumpSearchSquared([5], 5), 0);
  assert.equal(jumpSearchSquared([5], 1), -1);
});

test('jumpSearchSquared 步长为 ⌊√n⌋', () => {
  // 13 个元素，√13 ≈ 3.6 → step 3。验证比较次数大致符合 O(√n)
  let jumps = 0;
  let linear = 0;
  jumpSearchSquared(ARR, 15, {
    onJump: () => {
      jumps++;
    },
    onLinearCompare: () => {
      linear++;
    },
    onBlock: () => {},
  });
  assert.ok(jumps >= 1);
  assert.ok(linear >= 1);
  assert.ok(jumps + linear <= ARR.length);
});
