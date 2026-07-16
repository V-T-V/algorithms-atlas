import { test } from 'node:test';
import assert from 'node:assert/strict';
import { blake2b } from '../../src/algorithms/hashing/hash-blake2/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/hashing/hash-blake2/trace.ts';

test('blake2 确定性', () => {
  const a = blake2b('hello');
  const b = blake2b('hello');
  assert.deepEqual(a, b);
});
test('blake2 不同输入不同', () => {
  assert.notDeepEqual(blake2b('hello'), blake2b('world'));
});
test('blake2 输出长度', () => {
  assert.equal(blake2b('hello', 32).length, 4);
  assert.equal(blake2b('hello', 16).length, 2);
});
test('blake2 空输入', () => {
  assert.ok(blake2b('').length >= 2);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace(DEFAULT_INPUT).length >= 3);
});
