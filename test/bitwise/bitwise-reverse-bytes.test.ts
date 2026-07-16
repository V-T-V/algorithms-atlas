import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reverseBitsByBytes } from '../../src/algorithms/bitwise/bitwise-reverse-bytes/impl.ts';

/** 朴素逐位反转（与查表法对照）。 */
function naiveReverse(n: number, width: number): number {
  let r = 0;
  for (let i = 0; i < width; i++) {
    r = (r << 1) | (n & 1);
    n = Math.floor(n / 2);
  }
  // width 位以内的非负值
  return r >>> 0;
}

test('reverseBitsByBytes: 单字节 0b11010000 → 0b00001011', () => {
  assert.equal(reverseBitsByBytes(0b11010000, 1), 0b00001011);
});

test('reverseBitsByBytes: 与朴素逐位反转一致（32 位）', () => {
  const samples = [
    0x00000000, 0xffffffff, 0x80000000, 0x00000001, 0x12345678, 0x0f0f0f0f, 0xff00ff00, 0xa5a5a5a5,
    0xdeadbeef, 0x00010002,
  ];
  for (const s of samples) {
    const v = s >>> 0;
    assert.equal(
      reverseBitsByBytes(v, 4),
      naiveReverse(v, 32),
      `mismatch at 0x${v.toString(16).padStart(8, '0')}`,
    );
  }
});

test('reverseBitsByBytes: 双字节', () => {
  // 0x0102 → 字节顺序反转 + 位反转
  // 字节 0 (0x02=0b00000010) → 0b01000000
  // 字节 1 (0x01=0b00000001) → 0b10000000
  // 拼到对面：byte1-rev 在高位，byte0-rev 在低位
  assert.equal(reverseBitsByBytes(0x0102, 2), 0x4080);
});

test('reverseBitsByBytes: 全 0 与全 1', () => {
  assert.equal(reverseBitsByBytes(0x00000000, 4), 0);
  assert.equal(reverseBitsByBytes(0xffffffff, 4), 0xffffffff);
});

test('reverseBitsByBytes: 自反性（再反转还原）', () => {
  const v = 0x12345678;
  const once = reverseBitsByBytes(v, 4);
  const twice = reverseBitsByBytes(once, 4);
  assert.equal(twice, v);
});

test('reverseBitsByBytes: hooks 正确回调', () => {
  const bytes: Array<{ i: number; o: number; r: number }> = [];
  let doneResult: number | null = null;
  reverseBitsByBytes(0x01020304, 4, {
    onByte: (i, o, r) => bytes.push({ i, o, r }),
    onDone: (r) => (doneResult = r),
  });
  assert.equal(bytes.length, 4);
  assert.deepEqual(
    bytes.map((b) => b.i),
    [0, 1, 2, 3],
  );
  assert.deepEqual(
    bytes.map((b) => b.o),
    [0x04, 0x03, 0x02, 0x01],
  );
  assert.notEqual(doneResult, null);
});

test('reverseBitsByBytes: 非法入参抛错', () => {
  assert.throws(() => reverseBitsByBytes(-1, 4), RangeError);
  assert.throws(() => reverseBitsByBytes(0, 0), RangeError);
});
