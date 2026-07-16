import { test } from 'node:test';
import assert from 'node:assert/strict';
import { xorSwap } from '../../src/algorithms/bitwise/bit-swap-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-swap-2/trace.ts';
test('xorSwap 正确', () => {
  const [a, b] = xorSwap(10, 25);
  assert.equal(a, 25);
  assert.equal(b, 10);
  const [c, d] = xorSwap(0, 7);
  assert.equal(c, 7);
  assert.equal(d, 0);
  const [e, f] = xorSwap(-3, 8);
  assert.equal(e, 8);
  assert.equal(f, -3);
});
test('xorSwap 钩子触发3次', () => {
  let n = 0;
  xorSwap(1, 2, { onStep: () => n++ });
  assert.equal(n, 3);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
