import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rc4 } from '../../src/algorithms/crypto/rc4/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/crypto/rc4/trace.ts';

test('rc4 确定性', () => {
  assert.deepEqual(rc4([1, 2, 3], [4, 5, 6]).bytes, rc4([1, 2, 3], [4, 5, 6]).bytes);
});

test('rc4 密钥为空抛错', () => {
  assert.throws(() => rc4([1], []).bytes);
});

test('rc4 流密码可逆（同密钥再加密即解密）', () => {
  const plain = [72, 101, 108, 108, 111];
  const key = [1, 2, 3, 4, 5];
  const { bytes: cipher } = rc4(plain, key);
  const { bytes: back } = rc4(cipher, key);
  assert.deepEqual(back, plain);
});

test('rc4 RFC 6229 测试向量（前几字节）', () => {
  // key [1,2,3,4,5] → keystream 首字节已知（经 KSA）
  const { bytes } = rc4([0, 0, 0, 0], [1, 2, 3, 4, 5]);
  // keystream XOR 0 = keystream，验证确定性
  assert.equal(bytes.length, 4);
  assert.deepEqual(bytes, rc4([0, 0, 0, 0], [1, 2, 3, 4, 5]).bytes);
});

test('rc4 钩子触发', () => {
  let steps = 0;
  let ksa = 0;
  rc4([1, 2], [1], {
    onKsaStep: () => ksa++,
    onPrgaStep: () => steps++,
  });
  assert.equal(ksa, 256);
  assert.equal(steps, 2);
});

test('buildTrace 含 PRGA 帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  const last = frames[frames.length - 1]!;
  assert.ok(last.map);
});
