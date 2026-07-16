import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sdbm } from '../../src/algorithms/hashing/hash-sdbm/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/hashing/hash-sdbm/trace.ts';

test('sdbm 确定性', () => {
  assert.equal(sdbm('hello'), sdbm('hello'));
});
test('sdbm 不同输入不同', () => {
  assert.notEqual(sdbm('hello'), sdbm('world'));
});
test('sdbm 空输入 = 0', () => {
  assert.equal(sdbm(''), 0);
});
test('sdbm 32 位无符号', () => {
  assert.ok(sdbm('abc') >= 0);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace(DEFAULT_INPUT).length >= 3);
});
