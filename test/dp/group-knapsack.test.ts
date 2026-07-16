import { test } from 'node:test';
import assert from 'node:assert/strict';
import { groupKnapsack } from '../../src/algorithms/dp/group-knapsack/impl.ts';

test('group-knapsack 基本行为', () => {
  // 空组或容量 0 → 最大价值 0
  assert.equal(groupKnapsack([], 0), 0);
  assert.equal(groupKnapsack([], 5), 0);
  // 单组单件：容量够则取其价值
  assert.equal(groupKnapsack([[{ weight: 1, value: 5 }]], 1), 5);
  assert.equal(groupKnapsack([[{ weight: 2, value: 5 }]], 1), 0);
  // TODO: 补充该算法的期望输出断言
});
