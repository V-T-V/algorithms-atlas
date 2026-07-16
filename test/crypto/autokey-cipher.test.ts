import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  autokeyDecrypt,
  autokeyEncrypt,
  normalizePrimer,
} from '../../src/algorithms/crypto/autokey-cipher/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/crypto/autokey-cipher/trace.ts';

test('autokey normalizePrimer', () => {
  assert.equal(normalizePrimer('Qu e!'), 'QUE');
  assert.equal(normalizePrimer(''), 'A');
});

test('autokey 编解码往返一致', () => {
  for (const [s, p] of [
    ['ATTACKATDAWN', 'QUE'],
    ['HELLOWORLD', 'LEMON'],
    ['ABCDEF', 'Z'],
    ['A', 'K'],
  ] as const) {
    const c = autokeyEncrypt(s, p).text;
    assert.equal(autokeyDecrypt(c, p).text, s, `往返不一致: "${s}" primer="${p}"`);
  }
});

test('autokey 密钥流 = primer + 明文', () => {
  // 简单校验：primer 长度 1 时，第二位密钥 = 第一位明文
  // 明文 AB，primer K：
  //  C0 = (A + K) mod 26
  //  C1 = (B + A) mod 26   <- 密钥是明文第一位 A
  const r = autokeyEncrypt('AB', 'K');
  assert.equal(r.chars[0], String.fromCharCode(65 + ((0 + 10) % 26))); // A+K
  assert.equal(r.chars[1], String.fromCharCode(65 + ((1 + 0) % 26))); // B+A
});

test('autokey 非字母保留', () => {
  const { text } = autokeyEncrypt('A B!', 'K');
  assert.equal(text.length, 4);
  assert.equal(text[1], ' ');
});

test('autokey 空明文', () => {
  assert.equal(autokeyEncrypt('', 'KEY').text, '');
});

test('autokey 钩子被调用', () => {
  const maps: Array<[string, string]> = [];
  autokeyEncrypt('AB', 'K', { onMap: (_i, p, _k, c) => maps.push([p, c]) });
  assert.equal(maps.length, 2);
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.array, '首帧含 array');
  const last = frames[frames.length - 1]!;
  assert.ok(last.map, '末帧含 map');
});
