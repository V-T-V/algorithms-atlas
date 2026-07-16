import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sign } from '../../src/algorithms/bitwise/sign/impl.ts';

test('sign 基本行为', () => {
  assert.equal(sign(0), 0);
  assert.equal(sign(1), 1);
  assert.equal(sign(-1), -1);
  assert.equal(sign(42), 1);
  assert.equal(sign(-42), -1);
  assert.equal(sign(-2147483648), -1);
  assert.equal(sign(2147483647), 1);
});

test('sign 与 Math.sign 在 32 位整数上一致', () => {
  const samples = [-1000, -1, 0, 1, 999, 2147483647, -2147483648, 12345];
  for (const x of samples) assert.equal(sign(x), Math.sign(x | 0), `x=${x}`);
});

test('sign 仅返回 -1/0/1', () => {
  for (let x = -50; x <= 50; x++) {
    const s = sign(x);
    assert.ok(s === -1 || s === 0 || s === 1);
  }
});

test('sign 钩子被调用', () => {
  let called = 0;
  const r = sign(-9, {
    onResolve: (x, nonzero, sgn) => {
      called++;
      assert.equal(x, -9);
      assert.equal(nonzero, -1);
      assert.equal(sgn, -1);
    },
  });
  assert.equal(r, -1);
  assert.equal(called, 1);
});
