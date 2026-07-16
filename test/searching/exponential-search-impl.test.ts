import { test } from 'node:test';
import assert from 'node:assert/strict';
import { exponentialSearch } from '../../src/algorithms/searching/exponential-search-impl/impl.ts';

const ARR = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31];

test('exponentialSearch 命中各位置', () => {
  for (let i = 0; i < ARR.length; i++) {
    assert.equal(exponentialSearch(ARR, ARR[i]!), i, `应命中下标 ${i}`);
  }
});

test('exponentialSearch 未命中返回 -1', () => {
  assert.equal(exponentialSearch(ARR, 0), -1);
  assert.equal(exponentialSearch(ARR, 32), -1);
  assert.equal(exponentialSearch(ARR, 8), -1);
  assert.equal(exponentialSearch([], 5), -1);
});

test('exponentialSearch 边界', () => {
  assert.equal(exponentialSearch([5], 5), 0);
  assert.equal(exponentialSearch([5], 3), -1);
  assert.equal(exponentialSearch([1, 2], 2), 1);
});

test('exponentialSearch 钩子被调用', () => {
  let bounds = 0;
  let windows = 0;
  let done = 0;
  exponentialSearch(ARR, 19, {
    onBound: () => bounds++,
    onWindow: () => windows++,
    onDone: () => done++,
  });
  assert.ok(bounds >= 1, '应至少倍增一次');
  assert.ok(windows >= 1, '应定位区间');
  assert.equal(done, 1, '应恰好回调一次 onDone');
});
