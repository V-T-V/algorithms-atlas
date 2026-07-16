import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashShabal } from '../../src/algorithms/hashing/hash-shabal/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-shabal/trace.ts';
test('shabal 确定性', () => {
  assert.equal(hashShabal('a'), hashShabal('a'));
});
test('shabal 不同输入不同', () => {
  assert.notEqual(hashShabal('a'), hashShabal('b'));
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});
