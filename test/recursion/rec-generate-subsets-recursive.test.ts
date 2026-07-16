import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  generateSubsetsRecursive,
  generateSubsetsUnique,
} from '../../src/algorithms/recursion/rec-generate-subsets-recursive/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-generate-subsets-recursive/trace.ts';

test('rec-generate-subsets-recursive 数量正确', () => {
  const res = generateSubsetsRecursive([1, 2, 3]);
  assert.equal(res.length, 8);
});

test('rec-generate-subsets-recursive 含空集', () => {
  const res = generateSubsetsRecursive([1, 2]);
  assert.deepEqual(res[0], []);
});

test('rec-generate-subsets-recursive 去重版', () => {
  const res = generateSubsetsUnique([1, 2, 2]);
  assert.equal(res.length, 6); // [], [1], [2], [1,2], [2,2], [1,2,2]
});

test('rec-generate-subsets-recursive trace', () => {
  assert.ok(buildTrace().length > 2);
});
