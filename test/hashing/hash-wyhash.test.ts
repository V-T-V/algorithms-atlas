import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wyHash64 } from '../../src/algorithms/hashing/hash-wyhash/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/hashing/hash-wyhash/trace.ts';

test('hash-wyhash 确定性', () => {
  assert.equal(wyHash64('hello'), wyHash64('hello'));
});
test('hash-wyhash 不同输入不同', () => {
  assert.notEqual(wyHash64('hello'), wyHash64('world'));
});
test('hash-wyhash 空输入', () => {
  assert.ok(wyHash64('') >= 0n);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace(DEFAULT_INPUT).length >= 3);
});
