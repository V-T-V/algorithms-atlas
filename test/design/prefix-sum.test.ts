import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PrefixSum, prefixSum } from '../../src/algorithms/design/prefix-sum/impl.ts';

test('prefix-sum 构建正确的 prefix 数组', () => {
  const ps = new PrefixSum([1, 2, 3, 4, 5]);
  assert.deepEqual(ps.prefix, [0, 1, 3, 6, 10, 15]);
});

test('prefix-sum 区间求和正确', () => {
  const ps = new PrefixSum([3, 1, 4, 1, 5, 9, 2, 6]);
  assert.equal(ps.rangeSum(0, 0), 3);
  assert.equal(ps.rangeSum(0, 7), 31);
  assert.equal(ps.rangeSum(2, 5), 4 + 1 + 5 + 9);
  assert.equal(ps.rangeSum(5, 7), 9 + 2 + 6);
});

test('prefix-sum 单元素数组', () => {
  const ps = new PrefixSum([42]);
  assert.equal(ps.rangeSum(0, 0), 42);
});

test('prefix-sum 空数组', () => {
  const ps = new PrefixSum([]);
  assert.equal(ps.n, 0);
  assert.deepEqual(ps.prefix, [0]);
});

test('prefix-sum 非法区间抛错', () => {
  const ps = new PrefixSum([1, 2, 3]);
  assert.throws(() => ps.rangeSum(-1, 2), RangeError);
  assert.throws(() => ps.rangeSum(0, 3), RangeError);
  assert.throws(() => ps.rangeSum(2, 1), RangeError);
});

test('prefix-sum 钩子 onBuild 与 onQuery', () => {
  const builds: Array<[number, number]> = [];
  const queries: Array<[number, number, number]> = [];
  const ps = new PrefixSum([1, 2, 3], {
    onBuild: (i, sum) => builds.push([i, sum]),
  });
  assert.deepEqual(builds, [
    [0, 1],
    [1, 3],
    [2, 6],
  ]);
  ps.rangeSum(0, 2, { onQuery: (l, r, res) => queries.push([l, r, res]) });
  assert.deepEqual(queries, [[0, 2, 6]]);
});

test('prefix-sum 便捷函数 prefixSum', () => {
  assert.equal(prefixSum([5, 5, 5, 5], 1, 3), 15);
});

test('prefix-sum 含负数', () => {
  const ps = new PrefixSum([-2, 1, -3, 4, -1]);
  assert.equal(ps.rangeSum(0, 4), -1);
  assert.equal(ps.rangeSum(3, 3), 4);
});
