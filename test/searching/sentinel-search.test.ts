import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sentinelSearch } from '../../src/algorithms/searching/sentinel-search/impl.ts';

test('sentinelSearch 命中与未命中', () => {
  const a = [5, 2, 8, 1, 9, 3, 7, 4, 6]; // 无序也可
  assert.equal(sentinelSearch(a, 8), 2);
  assert.equal(sentinelSearch(a, 6), 8);
  assert.equal(sentinelSearch(a, 5), 0);
  assert.equal(sentinelSearch(a, 10), -1);
});

test('sentinelSearch 边界', () => {
  assert.equal(sentinelSearch([], 1), -1);
  assert.equal(sentinelSearch([5], 5), 0);
  assert.equal(sentinelSearch([5], 3), -1);
  assert.equal(sentinelSearch([1, 2, 3], 3), 2); // 末元素命中
});

test('sentinelSearch 不修改原数组', () => {
  const a = [5, 2, 8, 1];
  const copy = [...a];
  sentinelSearch(a, 8);
  assert.deepEqual(a, copy);
});

test('sentinelSearch 钩子', () => {
  let compares = 0;
  let done = -1;
  sentinelSearch([5, 2, 8, 1], 8, {
    onCompare: () => compares++,
    onDone: (i) => (done = i),
  });
  assert.ok(compares > 0);
  assert.equal(done, 2);
});
