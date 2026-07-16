import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spookyHash64 } from '../../src/algorithms/hashing/hash-spooky/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/hashing/hash-spooky/trace.ts';

test('hash-spooky 确定性', () => {
  assert.equal(spookyHash64('hello'), spookyHash64('hello'));
});
test('hash-spooky 不同输入不同', () => {
  assert.notEqual(spookyHash64('hello'), spookyHash64('world'));
});
test('hash-spooky 空输入', () => {
  assert.ok(spookyHash64('') >= 0n);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace(DEFAULT_INPUT).length >= 3);
});
