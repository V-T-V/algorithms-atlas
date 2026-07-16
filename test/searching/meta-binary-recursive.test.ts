import { test } from 'node:test';
import assert from 'node:assert/strict';
import { metaBinaryRecursive } from '../../src/algorithms/searching/meta-binary-recursive/impl.ts';

const ARR = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];

test('metaBinaryRecursive 命中', () => {
  assert.equal(metaBinaryRecursive(ARR, 2), 0);
  assert.equal(metaBinaryRecursive(ARR, 91), 9);
  assert.equal(metaBinaryRecursive(ARR, 23), 5);
  assert.equal(metaBinaryRecursive(ARR, 56), 7);
});

test('metaBinaryRecursive 未命中', () => {
  assert.equal(metaBinaryRecursive(ARR, 1), -1);
  assert.equal(metaBinaryRecursive(ARR, 100), -1);
  assert.equal(metaBinaryRecursive(ARR, 24), -1);
  assert.equal(metaBinaryRecursive(ARR, 50), -1);
});

test('metaBinaryRecursive 边界', () => {
  assert.equal(metaBinaryRecursive([], 1), -1);
  assert.equal(metaBinaryRecursive([5], 5), 0);
  assert.equal(metaBinaryRecursive([5], 3), -1);
});

test('metaBinaryRecursive 探测位数 = ⌈log n⌉', () => {
  let probes = 0;
  metaBinaryRecursive(ARR, 23, { onProbe: () => probes++ });
  // 10 个元素，⌈log2(10)⌉ = 4
  assert.equal(probes, 4);
});
