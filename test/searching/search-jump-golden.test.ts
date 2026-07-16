import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  jumpSearchGolden,
  type JumpGoldenHooks,
} from '../../src/algorithms/searching/search-jump-golden/impl.ts';

const ARR = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21];

test('search-jump-golden 命中', () => {
  assert.equal(jumpSearchGolden(ARR, 1), 0);
  assert.equal(jumpSearchGolden(ARR, 21), 10);
  assert.equal(jumpSearchGolden(ARR, 15), 7);
  assert.equal(jumpSearchGolden(ARR, 11), 5);
});
test('search-jump-golden 未命中', () => {
  assert.equal(jumpSearchGolden(ARR, 0), -1);
  assert.equal(jumpSearchGolden(ARR, 22), -1);
  assert.equal(jumpSearchGolden(ARR, 8), -1);
});
test('search-jump-golden 边界', () => {
  assert.equal(jumpSearchGolden([], 1), -1);
  assert.equal(jumpSearchGolden([5], 5), 0);
  assert.equal(jumpSearchGolden([5], 3), -1);
});
test('search-jump-golden 钩子', () => {
  let c = 0;
  jumpSearchGolden(ARR, 15, { onJump: () => c++ } as JumpGoldenHooks);
  assert.ok(c >= 1);
});
