import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  vigenere,
  vigenereDecipher,
  normalizeKey,
} from '../../src/algorithms/crypto/vigenere/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/crypto/vigenere/trace.ts';

test('vigenere 基本加密', () => {
  // H+K=R E+E=I L+Y=J L+K=V O+E=S
  assert.equal(vigenere('HELLO', 'KEY').text, 'RIJVS');
  // 经典教学例子：ATTACKATDAWN + LEMON -> LXFOPVEFRNHR
  assert.equal(vigenere('ATTACKATDAWN', 'LEMON').text, 'LXFOPVEFRNHR');
});

test('vigenere 空格不消耗密钥', () => {
  // H+K=E+Y=L+Y=L+K=O+E = RIJVS; 空格跳过（keyPos 保持 5）;
  // W+Y(5%3=2)=U, O+K(6%3=0)=Y, R+E(7%3=1)=V, L+Y(8%3=2)=J, D+K(9%3=0)=N
  assert.equal(vigenere('HELLO WORLD', 'KEY').text, 'RIJVS UYVJN');
});

test('vigenere 大小写保留', () => {
  const r = vigenere('Hello', 'KEY');
  assert.equal(r.text, 'Rijvs');
  assert.deepEqual(r.chars, ['R', 'i', 'j', 'v', 's']);
});

test('vigenere 非字母原样保留', () => {
  assert.equal(vigenere('AB, CD 12', 'B').text, 'BC, DE 12');
});

test('vigenereDecipher 能还原明文', () => {
  const plain = 'The quick brown fox jumps over the lazy dog!';
  const key = 'SECRET';
  const { text: cipher } = vigenere(plain, key);
  assert.equal(vigenereDecipher(cipher, key).text, plain);
});

test('vigenere 密钥含非字母会被规范化', () => {
  // 'K.E Y!' 规范化为 'KEY'
  assert.equal(vigenere('HELLO', 'K.E Y!').text, vigenere('HELLO', 'KEY').text);
});

test('vigenere 空密钥视为 A（零位移）', () => {
  assert.equal(vigenere('ABC', '').text, 'ABC');
  assert.equal(vigenere('ABC', '123').text, 'ABC');
});

test('normalizeKey 行为', () => {
  assert.equal(normalizeKey('key'), 'KEY');
  assert.equal(normalizeKey('K.E Y!'), 'KEY');
  assert.equal(normalizeKey('123'), 'A');
  assert.equal(normalizeKey(''), 'A');
});

test('vigenere 钩子被调用（密钥位置正确推进）', () => {
  const shifts: Array<[string, string, string]> = [];
  vigenere('A B', 'AB', false, {
    onShift: (_i, original, shifted, keyChar) => shifts.push([original, shifted, keyChar]),
  });
  // 'A' 用密钥第 0 位 'A'，空格跳过不消耗，'B' 仍用密钥第 1 位 'B'
  assert.deepEqual(shifts, [
    ['A', 'A', 'A'],
    ['B', 'C', 'B'],
  ]);
});

test('vigenere 跳过钩子对非字母触发', () => {
  const skipped: string[] = [];
  vigenere('A b, Z', 'A', false, { onSkip: (_i, ch) => skipped.push(ch) });
  assert.deepEqual(skipped, [' ', ',', ' ']);
});

test('buildTrace 生成有序帧且含终态', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2, '至少有初始帧与终态帧');
  const first = frames[0]!;
  assert.ok(first.array, '首帧含 array 可视化');
  assert.ok(first.map, '首帧含 map（密钥字母对照）');
  const last = frames[frames.length - 1]!;
  assert.ok(last.map, '末帧含 map（明文/密文对照）');
  const cipherEntry = last.map!.find((e) => e.key.startsWith('密文'));
  assert.equal(cipherEntry!.value, 'RIJVS UYVJN');
});
