import { test } from 'node:test';
import assert from 'node:assert/strict';
import { grayToBinary } from '../../src/algorithms/bitwise/gray-to-binary/impl.ts';

// 参考逐位解码
const refDecode = (g: number): number => {
  let b = 0;
  let mask = g >>> 0;
  while (mask) {
    b ^= mask;
    mask >>>= 1;
  }
  return b >>> 0;
};
// 二进制→格雷码（逆运算）
const binToGray = (b: number): number => (b ^ (b >>> 1)) >>> 0;

test('gray-to-binary 基本行为', () => {
  assert.equal(grayToBinary(0b1110), 0b1011); // 14 -> 11
  assert.equal(grayToBinary(0b1000), 0b1111); // 8 -> 15
  assert.equal(grayToBinary(0), 0);
  assert.equal(grayToBinary(0b1), 0b1);
});

test('gray-to-binary 与参考解码一致（0~1023）', () => {
  for (let g = 0; g < 1024; g++) assert.equal(grayToBinary(g), refDecode(g));
});

test('gray-to-binary 是 binaryToGray 的逆运算', () => {
  for (let b = 0; b < 256; b++) {
    const g = binToGray(b);
    assert.equal(grayToBinary(g), b, `b=${b} g=${g}`);
  }
});

test('gray-to-binary 钩子被调用', () => {
  let calls = 0;
  const r = grayToBinary(0b1110, { onXor: () => calls++ });
  assert.equal(r, 0b1011);
  assert.ok(calls > 0);
});
