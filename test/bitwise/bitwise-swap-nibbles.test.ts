import { test } from 'node:test';
import assert from 'node:assert/strict';
import { swapNibbles } from '../../src/algorithms/bitwise/bitwise-swap-nibbles/impl.ts';

test('swapNibbles: 基本用例 0b1010_0011 → 0b0011_1010', () => {
  assert.equal(swapNibbles(0b10100011), 0b00111010);
  assert.equal(swapNibbles(0xa3), 0x3a);
});

test('swapNibbles: 全部 256 个字节与朴素方法一致', () => {
  for (let b = 0; b < 256; b++) {
    const expected = ((b & 0x0f) << 4) | ((b & 0xf0) >> 4);
    assert.equal(swapNibbles(b), expected, `mismatch at ${b}`);
  }
});

test('swapNibbles: 自反性（再交换还原）', () => {
  for (const b of [0x00, 0xff, 0xab, 0x12, 0x80, 0x01, 0xf0, 0x0f]) {
    assert.equal(swapNibbles(swapNibbles(b)), b);
  }
});

test('swapNibbles: 边界值', () => {
  assert.equal(swapNibbles(0x00), 0x00);
  assert.equal(swapNibbles(0xff), 0xff);
  assert.equal(swapNibbles(0x0f), 0xf0);
  assert.equal(swapNibbles(0xf0), 0x0f);
});

test('swapNibbles: hooks 正确回调', () => {
  let low: number | null = null;
  let high: number | null = null;
  let done: number | null = null;
  swapNibbles(0x6c, {
    onLowNibble: (l) => (low = l),
    onHighNibble: (h) => (high = h),
    onDone: (r) => (done = r),
  });
  assert.equal(low, 0xc);
  assert.equal(high, 0x6);
  assert.equal(done, 0xc6);
});

test('swapNibbles: 非法入参抛错', () => {
  assert.throws(() => swapNibbles(-1), RangeError);
  assert.throws(() => swapNibbles(256), RangeError);
  assert.throws(() => swapNibbles(1.5), TypeError);
});
