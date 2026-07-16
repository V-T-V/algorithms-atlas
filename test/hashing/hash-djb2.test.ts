import { test } from 'node:test';
import assert from 'node:assert/strict';
import { djb2, djb2a } from '../../src/algorithms/hashing/hash-djb2/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/hashing/hash-djb2/trace.ts';

test('djb2 确定性', () => {
  assert.equal(djb2('hello'), djb2('hello'));
});

test('djb2 不同输入不同', () => {
  assert.notEqual(djb2('hello'), djb2('world'));
});

test('djb2 输出 32 位无符号', () => {
  for (const s of ['', 'a', 'abc', 'hello world']) {
    const h = djb2(s);
    assert.ok(h >= 0 && h < 0x100000000);
  }
});

test('djb2 空输入 = 5381', () => {
  assert.equal(djb2(''), 5381);
});

test('djb2a 确定性', () => {
  assert.equal(djb2a('hello'), djb2a('hello'));
});

test('djb2 字节数组输入', () => {
  assert.equal(djb2([104, 101, 108, 108, 111]), djb2('hello'));
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
