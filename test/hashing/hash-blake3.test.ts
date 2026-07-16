import { test } from 'node:test';
import assert from 'node:assert/strict';
import { blake3 } from '../../src/algorithms/hashing/hash-blake3/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/hashing/hash-blake3/trace.ts';

test('blake3 确定性', () => {
  assert.deepEqual(blake3('hello'), blake3('hello'));
});
test('blake3 不同输入不同', () => {
  assert.notDeepEqual(blake3('hello'), blake3('world'));
});
test('blake3 输出 4 个 64 位字', () => {
  assert.equal(blake3('hello').length, 4);
});
test('blake3 空输入', () => {
  assert.ok(blake3('').length === 4);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace(DEFAULT_INPUT).length >= 3);
});
