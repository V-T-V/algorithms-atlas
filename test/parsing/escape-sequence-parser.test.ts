import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseEscapes } from '../../src/algorithms/parsing/escape-sequence-parser/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/escape-sequence-parser/trace.ts';

test('parseEscapes 常用转义', () => {
  assert.equal(parseEscapes('a\\tb\\nc'), 'a\tb\nc');
  assert.equal(parseEscapes('a\\\\b'), 'a\\b');
  assert.equal(parseEscapes('\\"hi\\"'), '"hi"');
});

test('parseEscapes 十六进制 \\xHH', () => {
  assert.equal(parseEscapes('\\x41'), 'A'); // 0x41
  assert.equal(parseEscapes('\\x4e'), 'N');
});

test('parseEscapes Unicode \\uHHHH', () => {
  assert.equal(parseEscapes('\\u4e2d'), '中'); // U+4E2D
  assert.equal(parseEscapes('\\u0041'), 'A');
});

test('parseEscapes 无转义直接返回', () => {
  assert.equal(parseEscapes('hello'), 'hello');
  assert.equal(parseEscapes(''), '');
});

test('parseEscapes 混合', () => {
  assert.equal(parseEscapes('line1\\nline2\\t\\\ done'), 'line1\nline2\t\ done');
});

test('parseEscapes 非法转义触发钩子且容忍', () => {
  let invalid = 0;
  const out = parseEscapes('\\q', { onInvalid: () => invalid++ });
  assert.equal(invalid, 1);
  assert.equal(out, 'q'); // 容忍：原样输出
});

test('parseEscapes 特殊 0/b/f/v', () => {
  assert.equal(parseEscapes('\\0'), '\0');
  assert.equal(parseEscapes('\\b'), '\b');
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
});
