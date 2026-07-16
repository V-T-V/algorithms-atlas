import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyPartitionLabels } from '../../src/algorithms/greedy/greedy-partition-labels/impl.ts';

test('greedy-partition-labels 经典用例', () => {
  assert.deepEqual(greedyPartitionLabels('ababcbacadefegdehijhklij'), [9, 7, 8]);
});

test('greedy-partition-labels 全同字母', () => {
  assert.deepEqual(greedyPartitionLabels('aaaa'), [4]);
});

test('greedy-partition-labels 每个字符独立', () => {
  assert.deepEqual(greedyPartitionLabels('abcdef'), [1, 1, 1, 1, 1, 1]);
});
