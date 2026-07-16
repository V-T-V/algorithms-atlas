import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nextPower2 } from '../../src/algorithms/bitwise/next-power2/impl.ts';

test('next-power2 基本行为', () => {
  assert.equal(nextPower2(0), 1);
  assert.equal(nextPower2(1), 1);
  assert.equal(nextPower2(2), 2);
  assert.equal(nextPower2(3), 4);
  assert.equal(nextPower2(5), 8);
  assert.equal(nextPower2(8), 8);
  assert.equal(nextPower2(9), 16);
  assert.equal(nextPower2(33), 64);
  assert.equal(nextPower2(1024), 1024);
  assert.equal(nextPower2(1000), 1024);
});

test('next-power2 结果恒为 2 的幂且 >= x', () => {
  for (let x = 0; x <= 100000; x++) {
    const r = nextPower2(x);
    assert.ok(r >= x, `x=${x} r=${r}`);
    assert.ok((r & (r - 1)) === 0, `x=${x} r=${r} 应为 2 的幂`);
  }
});

test('next-power2 对 2 的幂返回自身', () => {
  for (let k = 0; k < 30; k++) assert.equal(nextPower2(1 << k), 1 << k);
});

test('next-power2 钩子被调用 5 次（x>1）', () => {
  let calls = 0;
  const r = nextPower2(33, { onPropagate: () => calls++ });
  assert.equal(r, 64);
  assert.equal(calls, 5);
});
