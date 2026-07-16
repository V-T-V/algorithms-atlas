import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cityHash64 } from '../../src/algorithms/hashing/hash-cityhash/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/hashing/hash-cityhash/trace.ts';

test('hash-cityhash 确定性', () => {
  assert.equal(cityHash64('hello'), cityHash64('hello'));
});
test('hash-cityhash 不同输入不同', () => {
  assert.notEqual(cityHash64('hello'), cityHash64('world'));
});
test('hash-cityhash 空输入', () => {
  assert.ok(cityHash64('') >= 0n);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace(DEFAULT_INPUT).length >= 3);
});
