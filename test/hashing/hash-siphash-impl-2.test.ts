import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sipHash } from '../../src/algorithms/hashing/hash-siphash-impl-2/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-siphash-impl-2/trace.ts';
test('SipHash 确定性', () => {
  assert.equal(sipHash('abc', [1, 2]), sipHash('abc', [1, 2]));
});
test('不同密钥不同哈希', () => {
  assert.notEqual(sipHash('abc', [1, 2]), sipHash('abc', [3, 4]));
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
