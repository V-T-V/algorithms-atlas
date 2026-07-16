import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stringLength } from '../../src/algorithms/recursion/recursive-string-length/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/recursive-string-length/trace.ts';

test('stringLength 基本长度', () => {
  assert.equal(stringLength('hello'), 5);
  assert.equal(stringLength('abc'), 3);
});

test('stringLength 空串', () => {
  assert.equal(stringLength(''), 0);
});

test('stringLength 单字符', () => {
  assert.equal(stringLength('x'), 1);
});

test('stringLength 含空格与符号', () => {
  assert.equal(stringLength('a b c!'), 6);
});

test('stringLength Unicode（基本多文种平面按 UTF-16 码元）', () => {
  assert.equal(stringLength('中文'), 2);
});

test('stringLength 与 .length 一致', () => {
  for (const s of ['', 'a', 'ab', 'hello world', '1234567890']) {
    assert.equal(stringLength(s), s.length, `"${s}"`);
  }
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
});
