import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rotl, rotr } from '../../src/algorithms/bitwise/bit-rotate-2/impl.ts';
import { buildTrace } from '../../src/algorithms/bitwise/bit-rotate-2/trace.ts';
test('rotl/rotr 正确', () => {
  assert.equal(rotl(0x0000ffff, 8), 0x00ffff00);
  assert.equal(rotr(0x0000ffff, 8), 0xff0000ff);
  assert.equal(rotl(0x12345678, 32), 0x12345678); // r mod 32 = 0
  assert.equal(rotl(0x12345678, 4), 0x23456781);
});
test('rotl 后 rotr 还原', () => {
  for (const x of [1, 0xdeadbeef, 0x12345678]) assert.equal(rotr(rotl(x, 13), 13), x >>> 0);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
