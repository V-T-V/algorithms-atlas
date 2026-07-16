import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countOccurrence } from '../../src/algorithms/searching/count-occurrence/impl.ts';

test('countOccurrence 基本', () => {
  const a = [1, 2, 2, 2, 3, 3, 4, 5, 5, 5];
  assert.equal(countOccurrence(a, 2), 3);
  assert.equal(countOccurrence(a, 5), 3);
  assert.equal(countOccurrence(a, 3), 2);
  assert.equal(countOccurrence(a, 1), 1);
  assert.equal(countOccurrence(a, 4), 1);
});

test('countOccurrence 不存在与边界', () => {
  const a = [1, 2, 2, 3];
  assert.equal(countOccurrence(a, 0), 0); // 比所有都小
  assert.equal(countOccurrence(a, 9), 0); // 比所有都大
  assert.equal(countOccurrence(a, 4), 0); // 在范围内但不存在
  assert.equal(countOccurrence([], 1), 0);
  assert.equal(countOccurrence([5], 5), 1);
  assert.equal(countOccurrence([5], 3), 0);
});

test('countOccurrence 全相同', () => {
  assert.equal(countOccurrence([7, 7, 7, 7], 7), 4);
  assert.equal(countOccurrence([7, 7, 7, 7], 1), 0);
});

test('countOccurrence 钩子', () => {
  let probes = 0;
  let doneCount = -1;
  countOccurrence([1, 2, 2, 3], 2, {
    onProbe: () => probes++,
    onDone: (c) => (doneCount = c),
  });
  assert.ok(probes > 0);
  assert.equal(doneCount, 2);
});
