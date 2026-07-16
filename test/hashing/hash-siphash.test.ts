import { test } from 'node:test';
import assert from 'node:assert/strict';
import { siphash24 } from '../../src/algorithms/hashing/hash-siphash/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/hashing/hash-siphash/trace.ts';

test('hash-siphash 确定性', () => {
  assert.equal(siphash24('hello'), siphash24('hello'));
});
test('hash-siphash 不同输入不同', () => {
  assert.notEqual(siphash24('hello'), siphash24('world'));
});
test('hash-siphash 空输入', () => {
  assert.ok(siphash24('') >= 0n);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace(DEFAULT_INPUT).length >= 3);
});
