import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reverseLookup } from '../../src/algorithms/bitwise/bit-reverse-lookup/impl.ts';

function naiveRev(x: number): number {
  let r = 0;
  for (let i = 0; i < 32; i++) {
    r = ((r << 1) | ((x >>> i) & 1)) >>> 0;
  }
  return r >>> 0;
}

test('reverseLookup 已知值', () => {
  assert.equal(reverseLookup(0), 0);
  assert.equal(reverseLookup(1), 0x80000000);
  assert.equal(reverseLookup(0x80000000), 1);
  assert.equal(reverseLookup(0x12345678), naiveRev(0x12345678));
});

test('reverseLookup 与朴素法一致', () => {
  const samples = [
    0, 1, 2, 0xff, 0x80000000, 0x12345678, 0xdeadbeef, 0xffffffff, 0x00010000, 0x00ff00ff,
  ];
  for (const s of samples) assert.equal(reverseLookup(s), naiveRev(s));
});

test('reverseLookup 自反性：reverse(reverse(x)) === x', () => {
  let seed = 13;
  for (let i = 0; i < 5000; i++) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const x = seed >>> 0;
    assert.equal(reverseLookup(reverseLookup(x)), x);
  }
});

test('reverseLookup 拒绝越界', () => {
  assert.throws(() => reverseLookup(-1), RangeError);
  assert.throws(() => reverseLookup(2.5), RangeError);
  assert.throws(() => reverseLookup(0x100000000), RangeError);
});
