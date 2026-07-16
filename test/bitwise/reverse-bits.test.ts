import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  reverseBits,
  reverseBits32,
  toBinaryArray,
} from '../../src/algorithms/bitwise/reverse-bits/impl.ts';

test('reverseBits 8 位已知值', () => {
  // 00010110 (22) -> 01101000 (104)
  assert.equal(reverseBits(22, 8), 104);
  // 10000000 (128) -> 00000001 (1)
  assert.equal(reverseBits(128, 8), 1);
  // 00000001 (1) -> 10000000 (128)
  assert.equal(reverseBits(1, 8), 128);
  // 11111111 (255) -> 11111111 (255)
  assert.equal(reverseBits(255, 8), 255);
  // 00000000 (0) -> 00000000 (0)
  assert.equal(reverseBits(0, 8), 0);
  // 01010101 (85) -> 10101010 (170)
  assert.equal(reverseBits(85, 8), 170);
});

test('reverseBits 双重反转复原', () => {
  for (let n = 0; n < 256; n++) {
    assert.equal(reverseBits(reverseBits(n, 8), 8), n, `${n} 双重反转应复原`);
  }
});

test('reverseBits 与暴力一致', () => {
  // 暴力：把位反转
  const brute = (n: number, width: number): number => {
    let r = 0;
    for (let i = 0; i < width; i++) {
      r |= ((n >>> i) & 1) << (width - 1 - i);
    }
    return r;
  };
  for (let n = 0; n < 256; n++) {
    assert.equal(reverseBits(n, 8), brute(n, 8), `n=${n}`);
  }
});

test('reverseBits 不同位宽', () => {
  // 4 位：1010 (10) -> 0101 (5)
  assert.equal(reverseBits(10, 4), 5);
  // 16 位：0x00FF -> 0xFF00
  assert.equal(reverseBits(0x00ff, 16), 0xff00);
});

test('reverseBits 拒绝非法输入', () => {
  assert.throws(() => reverseBits(-1, 8), RangeError);
  assert.throws(() => reverseBits(1.5, 8), RangeError);
  assert.throws(() => reverseBits(1, 0), RangeError);
  assert.throws(() => reverseBits(1, 33), RangeError);
});

test('reverseBits32 正确', () => {
  // 0x00000001 -> 0x80000000
  assert.equal(reverseBits32(1), 0x80000000);
  // 全 0 / 全 1 自反
  assert.equal(reverseBits32(0), 0);
  assert.equal(reverseBits32(0xffffffff), 0xffffffff);
  // 双重反转复原
  for (const n of [0, 1, 0x12345678, 0xffffffff, 0x80000000, 0xdeadbeef]) {
    assert.equal(reverseBits32(reverseBits32(n)), n >>> 0, `n=${n.toString(16)}`);
  }
});

test('toBinaryArray 正确', () => {
  assert.deepEqual(toBinaryArray(0, 4), [0, 0, 0, 0]);
  assert.deepEqual(toBinaryArray(10, 4), [1, 0, 1, 0]);
  assert.deepEqual(toBinaryArray(255, 8), [1, 1, 1, 1, 1, 1, 1, 1]);
});

test('reverseBits 钩子被调用', () => {
  let reads = 0;
  let accums = 0;
  let resultCalls = 0;
  let finalResult = -1;
  const r = reverseBits(22, 8, {
    onReadBit: (i, bit) => {
      reads++;
      assert.ok(i >= 0 && i < 8);
      assert.ok(bit === 0 || bit === 1);
    },
    onAccumulate: (res) => {
      accums++;
      assert.ok(res >= 0);
    },
    onResult: (res) => {
      resultCalls++;
      finalResult = res;
    },
  });
  assert.equal(r, 104);
  assert.equal(reads, 8, '应读取 8 位');
  assert.equal(accums, 8, '应累积 8 次');
  assert.equal(resultCalls, 1);
  assert.equal(finalResult, 104);
});
