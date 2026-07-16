import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  generateSubsetsBitmask,
  generateSubsetsBitmaskIter,
} from '../../src/algorithms/recursion/rec-generate-subsets-bitmask/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-generate-subsets-bitmask/trace.ts';

test('rec-generate-subsets-bitmask 数量正确', () => {
  const res = generateSubsetsBitmask([1, 2, 3]);
  assert.equal(res.length, 8);
});

test('rec-generate-subsets-bitmask 含空集和全集', () => {
  const res = generateSubsetsBitmask([1, 2]);
  assert.ok(res.some((s) => s.length === 0));
  assert.ok(res.some((s) => s.length === 2 && s[0] === 1 && s[1] === 2));
});

test('rec-generate-subsets-bitmask 与迭代版一致', () => {
  const a = generateSubsetsBitmask([1, 2, 3])
    .map((s) => s.sort((x, y) => x - y).join(','))
    .sort();
  const b = generateSubsetsBitmaskIter([1, 2, 3])
    .map((s) => s.sort((x, y) => x - y).join(','))
    .sort();
  assert.deepEqual(a, b);
});

test('rec-generate-subsets-bitmask trace', () => {
  assert.ok(buildTrace().length > 2);
});
