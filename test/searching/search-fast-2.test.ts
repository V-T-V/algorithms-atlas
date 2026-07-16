import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fastSearch2, type Fast2Hooks } from '../../src/algorithms/searching/search-fast-2/impl.ts';

const ARR = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21];

test('search-fast-2 命中', () => {
  assert.equal(fastSearch2(ARR, 1), 0);
  assert.equal(fastSearch2(ARR, 21), 10);
  assert.equal(fastSearch2(ARR, 15), 7);
  assert.equal(fastSearch2(ARR, 11), 5);
});
test('search-fast-2 未命中', () => {
  assert.equal(fastSearch2(ARR, 0), -1);
  assert.equal(fastSearch2(ARR, 22), -1);
  assert.equal(fastSearch2(ARR, 8), -1);
});
test('search-fast-2 边界', () => {
  assert.equal(fastSearch2([], 1), -1);
  assert.equal(fastSearch2([5], 5), 0);
  assert.equal(fastSearch2([5], 3), -1);
});
test('search-fast-2 钩子', () => {
  let c = 0;
  fastSearch2(ARR, 15, { onJump: () => c++ } as Fast2Hooks);
  assert.ok(c >= 1);
});
