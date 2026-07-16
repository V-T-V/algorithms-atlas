import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  jumpSearchClassic,
  type JumpClassicHooks,
} from '../../src/algorithms/searching/search-jump-classic/impl.ts';

const ARR = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21];

test('search-jump-classic 命中', () => {
  assert.equal(jumpSearchClassic(ARR, 1), 0);
  assert.equal(jumpSearchClassic(ARR, 21), 10);
  assert.equal(jumpSearchClassic(ARR, 15), 7);
  assert.equal(jumpSearchClassic(ARR, 11), 5);
});
test('search-jump-classic 未命中', () => {
  assert.equal(jumpSearchClassic(ARR, 0), -1);
  assert.equal(jumpSearchClassic(ARR, 22), -1);
  assert.equal(jumpSearchClassic(ARR, 8), -1);
});
test('search-jump-classic 边界', () => {
  assert.equal(jumpSearchClassic([], 1), -1);
  assert.equal(jumpSearchClassic([5], 5), 0);
  assert.equal(jumpSearchClassic([5], 3), -1);
});
test('search-jump-classic 钩子', () => {
  let c = 0;
  jumpSearchClassic(ARR, 15, { onJump: () => c++ } as JumpClassicHooks);
  assert.ok(c >= 1);
});
