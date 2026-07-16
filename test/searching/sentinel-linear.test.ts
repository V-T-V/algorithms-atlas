import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sentinelLinearSearch } from '../../src/algorithms/searching/sentinel-linear/impl.ts';

const ARR = [4, 2, 7, 1, 9, 3, 5, 8, 6];

test('sentinelLinearSearch 命中首次出现', () => {
  assert.equal(sentinelLinearSearch(ARR, 5), 6);
  assert.equal(sentinelLinearSearch(ARR, 4), 0);
  assert.equal(sentinelLinearSearch(ARR, 6), 8);
  assert.equal(sentinelLinearSearch([1, 2, 3, 3], 3), 2); // 首次
});

test('sentinelLinearSearch 未命中返回 -1', () => {
  assert.equal(sentinelLinearSearch(ARR, 0), -1);
  assert.equal(sentinelLinearSearch(ARR, 100), -1);
  assert.equal(sentinelLinearSearch([], 5), -1);
});

test('sentinelLinearSearch 边界', () => {
  assert.equal(sentinelLinearSearch([5], 5), 0);
  assert.equal(sentinelLinearSearch([5], 3), -1);
});

test('sentinelLinearSearch 不修改原数组', () => {
  const input = [3, 1, 2];
  sentinelLinearSearch(input, 1);
  assert.deepEqual(input, [3, 1, 2]);
});

test('sentinelLinearSearch 钩子被调用', () => {
  let compares = 0;
  let done = 0;
  sentinelLinearSearch(ARR, 5, {
    onCompare: () => compares++,
    onFound: () => done++,
  });
  assert.ok(compares >= 1, '应至少比较一次');
  assert.equal(done, 1, '应恰好回调一次 onFound');
});
