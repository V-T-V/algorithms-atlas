import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spreadsort } from '../../src/algorithms/sorting/spreadsort/impl.ts';

test('spreadsort 基本排序', () => {
  assert.deepEqual(spreadsort([]), []);
  assert.deepEqual(spreadsort([1]), [1]);
  assert.deepEqual(spreadsort([4, 2, 5, 1, 3]), [1, 2, 3, 4, 5]);
  assert.deepEqual(
    spreadsort([29, 10, 14, 37, 13, 25, 1, 30, 8, 22, 16, 4]),
    [1, 4, 8, 10, 13, 14, 16, 22, 25, 29, 30, 37],
  );
});

test('spreadsort 含负数', () => {
  assert.deepEqual(spreadsort([-3, 1, -1, 2, 0]), [-3, -1, 0, 1, 2]);
  assert.deepEqual(spreadsort([-5, -1, -3, -2, -4]), [-5, -4, -3, -2, -1]);
});

test('spreadsort 已有序 / 逆序 / 重复', () => {
  assert.deepEqual(spreadsort([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
  assert.deepEqual(spreadsort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(spreadsort([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});

test('spreadsort 不修改原数组', () => {
  const input = [3, 1, 2];
  spreadsort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('spreadsort 拒绝非 32 位整数', () => {
  assert.throws(() => spreadsort([1.5, 2]), RangeError);
  assert.throws(() => spreadsort([3000000000]), RangeError);
});

test('spreadsort 大数组正确', () => {
  const big = Array.from(
    { length: 300 },
    (_, i) => ((i * 1103515245 + 12345) & 0x7fffffff) % 10000,
  );
  const expected = [...big].sort((x, y) => x - y);
  assert.deepEqual(spreadsort(big), expected);
});
