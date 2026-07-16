import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ternarySearch } from '../../src/algorithms/searching/ternary-search/impl.ts';

test('ternarySearch 凸数组最大值', () => {
  assert.equal(ternarySearch([1, 3, 5, 7, 6, 4, 2]), 3); // 峰值 7
  assert.equal(ternarySearch([1, 2, 3, 4, 5]), 4); // 严格递增
  assert.equal(ternarySearch([5, 4, 3, 2, 1]), 0); // 严格递减
  assert.equal(ternarySearch([10]), 0);
  assert.equal(ternarySearch([]), -1);
});

test('ternarySearch 平顶', () => {
  // 最大值出现在多个位置，任一即可
  const a = [1, 5, 9, 9, 5, 1];
  const idx = ternarySearch(a);
  assert.equal(a[idx], 9);
});

test('ternarySearch 钩子', () => {
  let done = -1;
  ternarySearch([1, 3, 5, 7, 6, 4, 2], { onDone: (i) => (done = i) });
  assert.equal(done, 3);
});
