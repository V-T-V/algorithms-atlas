import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parityLookup } from '../../src/algorithms/bitwise/bit-parity-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-parity-2/trace.ts';
const ref = (x: number) => {
  let c = 0,
    v = x >>> 0;
  while (v) {
    c ^= v & 1;
    v >>>= 1;
  }
  return c;
};
test('parityLookup 正确', () => {
  assert.equal(parityLookup(7), 1);
  assert.equal(parityLookup(12), 0);
  assert.equal(parityLookup(255), 0);
  assert.equal(parityLookup(256), 1);
});
test('parityLookup 与逐位一致', () => {
  for (let x = 0; x < 5000; x++) assert.equal(parityLookup(x), ref(x));
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
