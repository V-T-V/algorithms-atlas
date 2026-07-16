import { test } from 'node:test';
import assert from 'node:assert/strict';
import { beaufort, normalizeKey } from '../../src/algorithms/crypto/beaufort-cipher/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/crypto/beaufort-cipher/trace.ts';

test('beaufort normalizeKey', () => {
  assert.equal(normalizeKey('Ke y!'), 'KEY');
  assert.equal(normalizeKey(''), 'A');
});

test('beaufort 已知加密', () => {
  // C = (K - P) mod 26。明文 A、密钥 B → (1-0)=1=B
  assert.equal(beaufort('A', 'B').text, 'B');
  // 明文 B、密钥 A → (0-1) mod 26 = 25 = Z
  assert.equal(beaufort('B', 'A').text, 'Z');
});

test('beaufort 自反（加密=解密）', () => {
  for (const [s, k] of [
    ['HELLOWORLD', 'KEY'],
    ['ATTACKATDAWN', 'LEMON'],
    ['PLAINTEXT', 'SECRET'],
  ] as const) {
    const c = beaufort(s, k).text;
    assert.equal(beaufort(c, k).text, s, `不自反: "${s}" key="${k}"`);
  }
});

test('beaufort 非字母保留', () => {
  assert.equal(
    beaufort('A B!', 'K').text,
    beaufort('A', 'K').text + ' ' + beaufort('B', 'K').text + '!',
  );
});

test('beaufort 空串', () => {
  assert.equal(beaufort('', 'KEY').text, '');
});

test('beaufort 大小写保持', () => {
  const { text } = beaufort('AbZ', 'K');
  assert.equal(text[0], text[0]!.toUpperCase());
  assert.equal(text[1], text[1]!.toLowerCase());
  assert.equal(text[2], text[2]!.toUpperCase());
});

test('beaufort 钩子被调用', () => {
  const maps: Array<[string, string]> = [];
  beaufort('AB', 'K', { onMap: (_i, p, _k, c) => maps.push([p, c]) });
  assert.equal(maps.length, 2);
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.array, '首帧含 array');
  const last = frames[frames.length - 1]!;
  assert.ok(last.map, '末帧含 map');
});
