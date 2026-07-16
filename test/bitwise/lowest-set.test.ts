import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lowestSet } from '../../src/algorithms/bitwise/lowest-set/impl.ts';

test('lowest-set 基本行为', () => {
  assert.equal(lowestSet(12), 4); // 1100 -> 0100
  assert.equal(lowestSet(10), 2); // 1010 -> 0010
  assert.equal(lowestSet(7), 1); // 0111 -> 0001
  assert.equal(lowestSet(40), 8); // 101000 -> 001000
  assert.equal(lowestSet(1), 1);
  assert.equal(lowestSet(32), 32);
  assert.equal(lowestSet(0), 0);
});

test('lowest-set 结果恒为 2 的幂（或 0）', () => {
  for (let x = 1; x <= 1000; x++) {
    const r = lowestSet(x);
    assert.ok(r > 0 && (r & (r - 1)) === 0, `x=${x} lowestSet=${r} 应为 2 的幂`);
  }
});

test('lowest-set 对 2^k 返回自身', () => {
  for (let k = 0; k < 20; k++) assert.equal(lowestSet(1 << k), 1 << k);
});

test('lowest-set 钩子被调用', () => {
  let called = 0;
  const r = lowestSet(18, {
    onIsolate: (x, isolated) => {
      called++;
      assert.equal(x, 18);
      assert.equal(isolated, 2); // 10010 -> 00010
    },
  });
  assert.equal(r, 2);
  assert.equal(called, 1);
});
