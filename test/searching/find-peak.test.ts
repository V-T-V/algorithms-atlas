import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findPeak } from '../../src/algorithms/searching/find-peak/impl.ts';

const isPeak = (a: readonly number[], i: number): boolean => {
  if (i < 0) return false;
  const left = i === 0 ? -Infinity : a[i - 1]!;
  const right = i === a.length - 1 ? -Infinity : a[i + 1]!;
  return a[i]! > left && a[i]! > right;
};

test('findPeak 找到合法峰', () => {
  const a = [1, 2, 3, 1];
  assert.ok(isPeak(a, findPeak(a)));
  const b = [1, 2, 1, 3, 5, 6, 4];
  assert.ok(isPeak(b, findPeak(b)));
});

test('findPeak 边界', () => {
  assert.ok(isPeak([1], findPeak([1])));
  assert.ok(isPeak([1, 2], findPeak([1, 2]))); // 末元素峰
  assert.ok(isPeak([2, 1], findPeak([2, 1]))); // 首元素峰
  assert.equal(findPeak([]), -1);
});

test('findPeak 钩子', () => {
  let done = -1;
  findPeak([1, 2, 3, 1], { onDone: (i) => (done = i) });
  assert.equal(done, 2);
});
