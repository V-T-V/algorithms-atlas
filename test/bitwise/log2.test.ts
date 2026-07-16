import { test } from 'node:test';
import assert from 'node:assert/strict';
import { log2 } from '../../src/algorithms/bitwise/log2/impl.ts';

test('log2 基本行为', () => {
  assert.equal(log2(0), -1);
  assert.equal(log2(1), 0);
  assert.equal(log2(2), 1);
  assert.equal(log2(3), 1);
  assert.equal(log2(8), 3);
  assert.equal(log2(10), 3);
  assert.equal(log2(16), 4);
  assert.equal(log2(255), 7);
  assert.equal(log2(1024), 10);
});

test('log2 对 2^k 返回 k', () => {
  for (let k = 0; k < 30; k++) assert.equal(log2(1 << k), k);
});

test('log2 在区间 [2^k, 2^(k+1)-1] 内恒为 k', () => {
  for (let k = 0; k < 15; k++) {
    for (let x = 1 << k; x < 1 << (k + 1); x++) assert.equal(log2(x), k, `x=${x}`);
  }
});

test('log2 钩子被调用', () => {
  let called = 0;
  const r = log2(100, {
    onResult: (x, lg) => {
      called++;
      assert.equal(x, 100);
      assert.equal(lg, 6); // 64 <= 100 < 128
    },
  });
  assert.equal(r, 6);
  assert.equal(called, 1);
});
