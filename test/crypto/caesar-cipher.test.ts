import { test } from 'node:test';
import assert from 'node:assert/strict';
import { caesarCipher, caesarDecipher } from '../../src/algorithms/crypto/caesar-cipher/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/crypto/caesar-cipher/trace.ts';

test('caesarCipher 基本位移', () => {
  assert.equal(caesarCipher('ABC', 1).text, 'BCD');
  assert.equal(caesarCipher('XYZ', 3).text, 'ABC');
  assert.equal(caesarCipher('HELLO', 3).text, 'KHOOR');
});

test('caesarCipher 大小写与符号保留', () => {
  assert.equal(caesarCipher('Hello, World!', 3).text, 'Khoor, Zruog!');
  assert.equal(caesarCipher('aBc 123', 1).text, 'bCd 123');
});

test('caesarCipher 空串与负位移', () => {
  assert.equal(caesarCipher('', 5).text, '');
  assert.equal(caesarCipher('BCD', -1).text, 'ABC');
  assert.equal(caesarCipher('ABC', -3).text, 'XYZ');
});

test('caesarCipher 大位移取模', () => {
  assert.equal(caesarCipher('A', 26).text, 'A');
  assert.equal(caesarCipher('A', 27).text, 'B');
  assert.equal(caesarCipher('A', 29).text, 'D');
});

test('caesarDecipher 能还原明文', () => {
  const plain = 'The quick brown fox!';
  const { text: cipher } = caesarCipher(plain, 7);
  assert.equal(caesarDecipher(cipher, 7).text, plain);
});

test('caesarCipher 钩子被调用', () => {
  const shifted: string[] = [];
  const skipped: string[] = [];
  caesarCipher('A b, Z', 1, {
    onShift: (_i, original, s) => shifted.push(`${original}->${s}`),
    onSkip: (_i, ch) => skipped.push(ch),
  });
  assert.deepEqual(shifted, ['A->B', 'b->c', 'Z->A']);
  assert.deepEqual(skipped, [' ', ',', ' ']);
});

test('buildTrace 生成有序帧且含终态', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2, '至少有初始帧与终态帧');
  const first = frames[0]!;
  assert.ok(first.array, '首帧含 array 可视化');
  assert.ok(first.note);
  const last = frames[frames.length - 1]!;
  assert.ok(last.map, '末帧含 map（明文/密文对照）');
  const cipherEntry = last.map!.find((e) => e.key.startsWith('密文'));
  assert.equal(cipherEntry!.value, 'KHOOR, Zruog!');
});
