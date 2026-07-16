import { test } from 'node:test';
import assert from 'node:assert/strict';
import { farmHash64 } from '../../src/algorithms/hashing/hash-farmhash/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/hashing/hash-farmhash/trace.ts';

test('hash-farmhash 确定性', () => {
  assert.equal(farmHash64('hello'), farmHash64('hello'));
});
test('hash-farmhash 不同输入不同', () => {
  assert.notEqual(farmHash64('hello'), farmHash64('world'));
});
test('hash-farmhash 空输入', () => {
  assert.ok(farmHash64('') >= 0n);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace(DEFAULT_INPUT).length >= 3);
});
