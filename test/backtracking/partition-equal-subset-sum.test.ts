import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  partitionEqualSubsetSum,
  type PartitionEqualSubsetSumHooks,
} from '../../src/algorithms/backtracking/partition-equal-subset-sum/impl.ts';

test('partition-equal-subset-sum [1,5,11,5] 可分', () => {
  const r = partitionEqualSubsetSum([1, 5, 11, 5]);
  assert.equal(r.canPartition, true);
  assert.equal(
    r.subset.reduce((a, b) => a + b, 0),
    11,
  );
});

test('partition-equal-subset-sum [1,2,3,5] 不可分', () => {
  assert.equal(partitionEqualSubsetSum([1, 2, 3, 5]).canPartition, false);
});

test('partition-equal-subset-sum 总和为奇数直接 false', () => {
  assert.equal(partitionEqualSubsetSum([1, 2, 5]).canPartition, false);
  assert.equal(partitionEqualSubsetSum([2, 2, 3, 5]).canPartition, false);
});

test('partition-equal-subset-sum 单元素不可分', () => {
  assert.equal(partitionEqualSubsetSum([1]).canPartition, false);
});

test('partition-equal-subset-sum 空数组可分（目标和 0）', () => {
  assert.equal(partitionEqualSubsetSum([]).canPartition, true);
});

test('partition-equal-subset-sum 全相同偶数个可分', () => {
  // [2,2,2,2] → 4+4
  assert.equal(partitionEqualSubsetSum([2, 2, 2, 2]).canPartition, true);
  // [3,3,3] 总和 9 奇数 → false
  assert.equal(partitionEqualSubsetSum([3, 3, 3]).canPartition, false);
});

test('partition-equal-subset-sum 大数测试', () => {
  // [100] → 总和 100，target=50，但 100>50 → 不可分
  assert.equal(partitionEqualSubsetSum([100]).canPartition, false);
  // [1,2,5] 总和 8 → target 4：1+? 无法，5 太大 → 不可
  assert.equal(partitionEqualSubsetSum([1, 2, 5]).canPartition, false);
});

test('partition-equal-subset-sum 找到的子集和恰为 target', () => {
  const cases: number[][] = [
    [1, 5, 11, 5],
    [1, 2, 3, 4, 5, 6, 7],
    [3, 3, 3, 4, 5],
  ];
  for (const c of cases) {
    const total = c.reduce((a, b) => a + b, 0);
    if (total % 2 !== 0) continue;
    const r = partitionEqualSubsetSum(c);
    if (r.canPartition) {
      assert.equal(
        r.subset.reduce((a, b) => a + b, 0),
        total / 2,
      );
    }
  }
});

test('partition-equal-subset-sum 钩子被调用', () => {
  let includes = 0;
  let solutions = 0;
  const hooks: PartitionEqualSubsetSumHooks = {
    onInclude: () => includes++,
    onSolution: () => solutions++,
  };
  partitionEqualSubsetSum([1, 5, 11, 5], hooks);
  assert.ok(includes > 0);
  assert.equal(solutions, 1);
});
