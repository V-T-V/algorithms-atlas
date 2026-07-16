import { test } from 'node:test';
import assert from 'node:assert/strict';
import { salsa20Core, salsa20Serialize } from '../../src/algorithms/crypto/crypto-salsa20/impl.ts';

test('crypto-salsa20 常数状态有确定非平凡输出', () => {
  // 含 "expand 32-byte k" 常数的状态应产生非平凡输出
  const input = [
    0x61707865, 0x3320646e, 0x79622d32, 0x6b206574, 0x01020304, 0x05060708, 0x090a0b0c, 0x0d0e0f10,
    0x11121314, 0x15161718, 0x191a1b1c, 0x1d1e1f20, 0x00000001, 0x00000000, 0x00000000, 0x00000000,
  ];
  const out = salsa20Core(input);
  const bytes = salsa20Serialize(out);
  assert.equal(bytes.length, 64);
  // 输出不应与输入相同（混淆）
  const inputBytes = salsa20Serialize(input);
  assert.notDeepEqual(Array.from(bytes), Array.from(inputBytes));
});

test('crypto-salsa20 确定性', () => {
  const input = Array.from({ length: 16 }, (_, i) => i);
  const a = salsa20Core(input);
  const b = salsa20Core(input);
  assert.deepEqual(a, b);
});

test('crypto-salsa20 输入影响输出', () => {
  const base = Array.from({ length: 16 }, () => 0);
  const modified = [...base];
  modified[0] = 1;
  assert.notDeepEqual(salsa20Core(base), salsa20Core(modified));
});
