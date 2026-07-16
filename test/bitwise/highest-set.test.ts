import { test } from 'node:test';
import assert from 'node:assert/strict';
import { highestSet } from '../../src/algorithms/bitwise/highest-set/impl.ts';

test('highest-set 基本行为', () => {
  assert.equal(highestSet(0), 0);
  assert.equal(highestSet(1), 1);
  assert.equal(highestSet(18), 16); // 10010 -> 最高位 16
  assert.equal(highestSet(256), 256);
  assert.equal(highestSet(1000), 512);
  assert.equal(highestSet(7), 4); // 111 -> 100
});

test('highest-set 对 2^k 返回自身', () => {
  for (let k = 0; k < 30; k++) assert.equal(highestSet(1 << k), 1 << k);
});

test('highest-set 结果恒为 <= x 的最大 2 的幂', () => {
  for (let x = 1; x <= 10000; x++) {
    const r = highestSet(x);
    assert.ok(r <= x && r * 2 > x, `x=${x} highestSet=${r} 应为最大的 <=x 的 2 的幂`);
  }
});

test('highest-set 钩子被调用', () => {
  let calls = 0;
  const r = highestSet(100, {
    onPropagate: () => calls++,
  });
  assert.equal(r, 64);
  assert.equal(calls, 5); // 5 次右移传播
});
