import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rangeXor } from '../../src/algorithms/bitwise/bit-xor-range-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-xor-range-2/trace.ts';
const brute = (m: number, n: number) => {
  let r = 0;
  for (let i = m; i <= n; i++) r ^= i;
  return r;
};
test('rangeXor 与暴力一致', () => {
  for (const [m, n] of [
    [3, 5],
    [0, 7],
    [10, 15],
    [4, 4],
    [1, 100],
    [50, 99],
  ] as const)
    assert.equal(rangeXor(m, n), brute(m, n));
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
