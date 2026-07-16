import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashGostImpl } from '../../src/algorithms/hashing/hash-gost-impl/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-gost-impl/trace.ts';

test('hash-gost-impl 确定性', () => {
  assert.deepEqual(hashGostImpl('a'), hashGostImpl('a'));
});

test('hash-gost-impl 不同输入不同', () => {
  assert.notDeepEqual(hashGostImpl('a'), hashGostImpl('b'));
});

test('hash-gost-impl 输出 4 个字', () => {
  assert.equal(hashGostImpl('a').length, 4);
});

test('hash-gost-impl 空输入有效', () => {
  assert.ok(hashGostImpl('').length === 4);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 3);
});
