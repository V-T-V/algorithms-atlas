import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bitReversal } from '../../src/algorithms/bitwise/bit-reversal/impl.ts';

const refRev = (x: number, bits: number): number => {
  let r = 0;
  for (let i = 0; i < bits; i++) if ((x >>> i) & 1) r |= 1 << (bits - 1 - i);
  return r >>> 0;
};

test('bit-reversal 基本行为', () => {
  // 6 在 4 位字段中为 0110，整体反转后仍为 0110 = 6
  assert.equal(bitReversal(0b0110, 4), 0b0110);
  assert.equal(bitReversal(1, 8), 0b10000000); // 1 -> 128
  assert.equal(bitReversal(0b1010, 4), 0b0101); // 10 -> 5
  assert.equal(bitReversal(0, 8), 0);
  assert.equal(bitReversal(0b0011, 4), 0b1100); // 3 -> 12
});

test('bit-reversal 与逐位参考一致', () => {
  for (let bits = 1; bits <= 16; bits++) {
    for (let x = 0; x < Math.min(1 << bits, 1024); x++) {
      assert.equal(bitReversal(x, bits), refRev(x, bits), `x=${x} bits=${bits}`);
    }
  }
});

test('bit-reversal 两次反转回到原值', () => {
  for (let x = 0; x < 256; x++) {
    assert.equal(bitReversal(bitReversal(x, 8), 8), x);
  }
});

test('bit-reversal 钩子被调用 5 次', () => {
  let calls = 0;
  const r = bitReversal(0b1010, 4, { onSwap: () => calls++ });
  assert.equal(r, 0b0101);
  assert.equal(calls, 5);
});
