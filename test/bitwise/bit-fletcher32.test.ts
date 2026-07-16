import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fletcher32 } from '../../src/algorithms/bitwise/bit-fletcher32/impl.ts';

function bytes(s: string): number[] {
  return s.split('').map((c) => c.charCodeAt(0));
}

/** 朴素参考实现（与 impl 等价，独立写出用于交叉验证）。 */
function fletcher32Ref(bytesArr: readonly number[]): number {
  let s1 = 0xffff;
  let s2 = 0xffff;
  for (let i = 0; i < bytesArr.length; i += 2) {
    const lo = bytesArr[i]!;
    const hi = i + 1 < bytesArr.length ? bytesArr[i + 1]! : 0;
    const word = (hi << 8) | lo;
    s1 = (s1 + word) % 65535;
    s2 = (s2 + s1) % 65535;
  }
  return ((s2 << 16) | s1) >>> 0;
}

test('fletcher32 空输入', () => {
  assert.equal(fletcher32([]), 0xffffffff);
});

test('fletcher32 与参考实现一致', () => {
  const samples = [
    bytes(''),
    bytes('a'),
    bytes('ab'),
    bytes('abc'),
    bytes('abcd'),
    bytes('abcde'),
    bytes('abcdefgh'),
  ];
  for (const s of samples) assert.equal(fletcher32(s), fletcher32Ref(s));
});

test('fletcher32 偶数/奇数字节一致', () => {
  // 偶数 vs 末尾加一个 0 字节应相同
  assert.equal(fletcher32(bytes('abcd')), fletcher32([...bytes('abcd'), 0]));
});

test('fletcher32 顺序敏感', () => {
  assert.notEqual(fletcher32(bytes('ab')), fletcher32(bytes('ba')));
});

test('fletcher32 拒绝非法字节', () => {
  assert.throws(() => fletcher32([256]), RangeError);
  assert.throws(() => fletcher32([-1]), RangeError);
  assert.throws(() => fletcher32([1.5]), RangeError);
});
