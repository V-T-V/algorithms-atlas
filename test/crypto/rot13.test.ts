import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rot13 } from '../../src/algorithms/crypto/rot13/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/crypto/rot13/trace.ts';

test('rot13 已知映射', () => {
  assert.equal(rot13('A').text, 'N');
  assert.equal(rot13('N').text, 'A');
  assert.equal(rot13('a').text, 'n');
  assert.equal(rot13('Z').text, 'M');
});

test('rot13 自对合（两次还原）', () => {
  for (const s of ['Hello, World!', 'ROT13', 'abcXYZ', 'The Quick Brown Fox']) {
    assert.equal(rot13(rot13(s).text).text, s, `不自对合: "${s}"`);
  }
});

test('rot13 非字母保留', () => {
  assert.equal(rot13('123!@#').text, '123!@#');
});

test('rot13 空串', () => {
  assert.equal(rot13('').text, '');
});

test('rot13 大小写保持', () => {
  const { text } = rot13('AbZ');
  assert.equal(text[0], text[0]!.toUpperCase());
  assert.equal(text[1], text[1]!.toLowerCase());
  assert.equal(text[2], text[2]!.toUpperCase());
});

test('rot13 钩子被调用', () => {
  const shifts: Array<[string, string]> = [];
  rot13('AB', { onShift: (_i, o, s) => shifts.push([o, s]) });
  assert.equal(shifts.length, 2);
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.array, '首帧含 array');
  const last = frames[frames.length - 1]!;
  assert.ok(last.map, '末帧含 map');
});
