import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kFib, isFib } from '../../src/algorithms/searching/k-fib/impl.ts';

test('kFib 序列', () => {
  assert.equal(kFib(0), 0);
  assert.equal(kFib(1), 1);
  assert.equal(kFib(2), 1);
  assert.equal(kFib(3), 2);
  assert.equal(kFib(10), 55);
  assert.equal(kFib(20), 6765);
});

test('kFib 非法输入', () => {
  assert.ok(Number.isNaN(kFib(-1)));
  assert.ok(Number.isNaN(kFib(2.5)));
});

test('isFib', () => {
  assert.equal(isFib(0), true);
  assert.equal(isFib(1), true);
  assert.equal(isFib(8), true);
  assert.equal(isFib(55), true);
  assert.equal(isFib(4), false);
  assert.equal(isFib(-1), false);
});

test('kFib 钩子', () => {
  let steps = 0;
  kFib(5, { onStep: () => steps++ });
  assert.equal(steps, 6); // 0..5 共 6 项
});
