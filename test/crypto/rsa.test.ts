import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  rsa,
  rsaKeygen,
  rsaEncryptChar,
  rsaDecryptChar,
  modPow,
  modInverse,
  gcd,
  chooseE,
} from '../../src/algorithms/crypto/rsa/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/crypto/rsa/trace.ts';

test('gcd / modInverse 基本数论', () => {
  assert.equal(gcd(12, 8), 4);
  assert.equal(gcd(7, 20), 1);
  // 7 的逆元 mod 20：7*3=21≡1
  assert.equal(modInverse(7, 20), 3);
  // 3 的逆元 mod 11：3*4=12≡1
  assert.equal(modInverse(3, 11), 4);
});

test('modPow 快速幂正确', () => {
  assert.equal(modPow(2, 10, 1000), 24);
  assert.equal(modPow(4, 7, 33), 16);
  assert.equal(modPow(16, 3, 33), 4);
});

test('chooseE 选出与 phi 互素的指数', () => {
  // phi=20：候选 2,3(与20互素) → 选 3
  assert.equal(chooseE(20), 3);
  // phi=(7-1)(11-1)=60：2 不互素、3 不互素(60%3==0)、7 互素 → 7
  // 但 60: gcd(3,60)=3, gcd(7,60)=1 → 7
  assert.equal(chooseE(60), 7);
});

test('rsaKeygen 生成一致的密钥', () => {
  const key = rsaKeygen(3, 11);
  assert.equal(key.n, 33);
  assert.equal(key.phi, 20);
  assert.equal(gcd(key.e, key.phi), 1);
  // e·d ≡ 1 mod φ
  assert.equal((key.e * key.d) % key.phi, 1);
});

test('rsa 加解密一致（p=3,q=11，e=3,d=7）', () => {
  const r = rsa([4, 11, 29], 3, 11);
  // chooseE(20)=3（第一个与 20 互素的数），d=7
  assert.equal(r.key.e, 3);
  assert.equal(r.key.d, 7);
  // 4^3 mod 33=31, 11^3 mod 33=11, 29^3 mod 33=2
  assert.deepEqual(r.cipher, [31, 11, 2]);
  assert.deepEqual(r.plain, [4, 11, 29]);
});

test('rsa 加密后能用私钥还原任意 m<n', () => {
  const key = rsaKeygen(5, 11); // n=55
  for (let m = 0; m < key.n; m++) {
    const c = rsaEncryptChar(m, key.e, key.n);
    assert.equal(rsaDecryptChar(c, key.d, key.n), m, `m=${m} 应能还原`);
  }
});

test('rsa 单字符加解密互逆', () => {
  const key = rsaKeygen(3, 11);
  const c = rsaEncryptChar(7, key.e, key.n);
  assert.equal(rsaDecryptChar(c, key.d, key.n), 7);
});

test('rsa 钩子被调用（密钥生成 + 逐字符）', () => {
  const events: string[] = [];
  rsa([4], 3, 11, {
    onPrimes: (p, q) => events.push(`primes ${p},${q}`),
    onModulus: (n, phi) => events.push(`n=${n},phi=${phi}`),
    onPublicExponent: (e) => events.push(`e=${e}`),
    onPrivateExponent: (d) => events.push(`d=${d}`),
    onEncrypt: (i, m, c) => events.push(`enc${i}:${m}->${c}`),
    onDecrypt: (i, c, m) => events.push(`dec${i}:${c}->${m}`),
  });
  assert.ok(events.includes('primes 3,11'));
  assert.ok(events.includes('n=33,phi=20'));
  assert.ok(events.some((e) => e.startsWith('e=')));
  assert.ok(events.some((e) => e.startsWith('d=')));
  assert.ok(events.includes('enc0:4->31'));
  assert.ok(events.includes('dec0:31->4'));
});

test('buildTrace 生成有序帧且含终态', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 6, '至少有密钥生成 4 帧 + 加解密 + 终态');
  const first = frames[0]!;
  assert.ok(first.aux, '首帧含 aux（密钥参数）');
  const last = frames[frames.length - 1]!;
  assert.ok(last.map, '末帧含 map（公钥/私钥/明文/密文）');
  const cipherEntry = last.map!.find((e) => e.key.startsWith('密文'));
  assert.equal(cipherEntry!.value, '31, 11, 2');
  const recoveredEntry = last.map!.find((e) => e.key.startsWith('还原'));
  assert.equal(recoveredEntry!.value, '4, 11, 29');
});
