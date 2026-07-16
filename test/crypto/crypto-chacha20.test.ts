import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  chacha20Core,
  chacha20Serialize,
} from '../../src/algorithms/crypto/crypto-chacha20/impl.ts';

test('crypto-chacha20 常数状态有确定非平凡输出', () => {
  const input = [
    0x61707865, 0x3320646e, 0x79622d32, 0x6b206574, 0x01020304, 0x05060708, 0x090a0b0c, 0x0d0e0f10,
    0x11121314, 0x15161718, 0x191a1b1c, 0x1d1e1f20, 0x00000001, 0x00000000, 0x00000000, 0x00000000,
  ];
  const out = chacha20Core(input);
  const bytes = chacha20Serialize(out);
  assert.equal(bytes.length, 64);
  const inputBytes = chacha20Serialize(input);
  assert.notDeepEqual(Array.from(bytes), Array.from(inputBytes));
});

test('crypto-chacha20 确定性', () => {
  const input = Array.from({ length: 16 }, (_, i) => i * 17);
  const a = chacha20Core(input);
  const b = chacha20Core(input);
  assert.deepEqual(a, b);
});

test('crypto-chacha20 输入影响输出', () => {
  const base = Array.from({ length: 16 }, (_, i) => i * 17);
  const modified = [...base];
  modified[0] = base[0]! + 1;
  assert.notDeepEqual(chacha20Core(base), chacha20Core(modified));
});
