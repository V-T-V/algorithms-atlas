import { test } from 'node:test';
import assert from 'node:assert/strict';
import { swap } from '../../src/algorithms/bitwise/swap/impl.ts';

test('swap 基本行为', () => {
  assert.deepEqual(swap([1, 2]), [2, 1]);
  assert.deepEqual(swap([5, 9]), [9, 5]);
  assert.deepEqual(swap([0, 0]), [0, 0]);
  assert.deepEqual(swap([-3, 7]), [7, -3]);
});

test('swap 大数与相等值', () => {
  assert.deepEqual(swap([2147483647, 1]), [1, 2147483647]);
  assert.deepEqual(swap([42, 42]), [42, 42]); // 值相等仍正确
});

test('swap 返回新元组，不改原数组', () => {
  const pair: [number, number] = [3, 8];
  const out = swap(pair);
  assert.deepEqual(out, [8, 3]);
  assert.deepEqual(pair, [3, 8]);
});

test('swap 钩子被调用三次', () => {
  const steps: Array<[number, number, number]> = [];
  const [a, b] = swap([6, 3], {
    onStep: (step, av, bv) => steps.push([step, av, bv]),
  });
  assert.equal(steps.length, 3);
  assert.deepEqual(steps[0]!.slice(1), [6 ^ 3, 3]); // a=a^b, b 不变
  assert.deepEqual(steps[1]!.slice(1), [6 ^ 3, 6]); // b=a^b=原a
  assert.equal(a, 3);
  assert.equal(b, 6);
});
