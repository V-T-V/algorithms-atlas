import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fasthash32 } from '../../src/algorithms/hashing/hash-fasthash/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/hashing/hash-fasthash/trace.ts';

test('hash-fasthash 确定性', () => {
  assert.equal(fasthash32('hello'), fasthash32('hello'));
});
test('hash-fasthash 不同输入不同', () => {
  assert.notEqual(fasthash32('hello'), fasthash32('world'));
});
test('hash-fasthash 32 位无符号', () => {
  assert.ok(fasthash32('abc') >= 0);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace(DEFAULT_INPUT).length >= 3);
});
