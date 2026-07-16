import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  affine,
  affineDecipher,
  isCoprimeWith26,
} from '../../src/algorithms/crypto/affine/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/crypto/affine/trace.ts';

test('affine 加密已知值 (a=5,b=8)', () => {
  // E(x)=5x+8 mod 26. A(0)->8(I), B(1)->13(N), C(2)->18(S)
  assert.equal(affine('ABC', 5, 8).text, 'INS');
  assert.equal(affine('AFFINE', 5, 8).text, 'IHHWVC');
});

test('affine 大小写与符号保留', () => {
  assert.equal(affine('Hello, World!', 5, 8).text, 'Rclla, Oaplx!');
});

test('affine 非互素 a 抛错', () => {
  assert.equal(isCoprimeWith26(2), false);
  assert.throws(() => affine('A', 2, 3));
});

test('affineDecipher 能还原明文', () => {
  const plain = 'The quick brown fox!';
  const { text: cipher } = affine(plain, 7, 3);
  assert.equal(affineDecipher(cipher, 7, 3).text, plain);
});

test('affine 钩子被调用', () => {
  const enc: string[] = [];
  affine('AB', 5, 8, { onEncrypt: (_i, o, e) => enc.push(`${o}->${e}`) });
  assert.deepEqual(enc, ['A->I', 'B->N']);
});

test('buildTrace 末帧含密文', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
  const last = frames[frames.length - 1]!;
  assert.ok(last.map);
  assert.equal(last.map!.find((e) => e.key.startsWith('密文'))!.value, 'IHHWVC');
});
