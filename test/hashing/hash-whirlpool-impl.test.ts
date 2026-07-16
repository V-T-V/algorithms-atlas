import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashWhirlpoolImpl } from '../../src/algorithms/hashing/hash-whirlpool-impl/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-whirlpool-impl/trace.ts';

test('hash-whirlpool-impl 确定性', () => {
  assert.deepEqual(hashWhirlpoolImpl('a'), hashWhirlpoolImpl('a'));
});

test('hash-whirlpool-impl 不同输入不同', () => {
  assert.notDeepEqual(hashWhirlpoolImpl('a'), hashWhirlpoolImpl('b'));
});

test('hash-whirlpool-impl 输出 4 个字', () => {
  assert.equal(hashWhirlpoolImpl('a').length, 4);
});

test('hash-whirlpool-impl 空输入有效', () => {
  assert.ok(hashWhirlpoolImpl('').length === 4);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 3);
});
