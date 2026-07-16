import { test } from 'node:test';
import assert from 'node:assert/strict';
import { xxteaEncrypt, xxteaDecrypt } from '../../src/algorithms/crypto/crypto-xxtea/impl.ts';

test('crypto-xxtea 加解密往返', () => {
  const v = [0x12345678, 0x9abcdef0, 0xdeadbeef, 0xcafebabe];
  const key = [0x11111111, 0x22222222, 0x33333333, 0x44444444] as const;
  const enc = xxteaEncrypt([...v], key);
  const dec = xxteaDecrypt([...enc], key);
  assert.deepEqual(
    dec.map((x) => x >>> 0),
    v.map((x) => x >>> 0),
  );
});

test('crypto-xxtea 最小长度2', () => {
  const v = [0x1, 0x2];
  const key = [0, 0, 0, 0] as const;
  const enc = xxteaEncrypt([...v], key);
  const dec = xxteaDecrypt([...enc], key);
  assert.deepEqual(
    dec.map((x) => x >>> 0),
    v,
  );
});

test('crypto-xxtea 加密改变数据', () => {
  const key = [0x5, 0x6, 0x7, 0x8] as const;
  const v = [0xaaaa, 0xbbbb];
  const enc = xxteaEncrypt([...v], key);
  assert.notDeepEqual(
    enc.map((x) => x >>> 0),
    v,
  );
});
