import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pjwHash } from '../../src/algorithms/hashing/hash-pjw/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-pjw/trace.ts';
test('PJW 确定性', () => {
  assert.equal(pjwHash('abc'), pjwHash('abc'));
  assert.notEqual(pjwHash('abc'), pjwHash('xyz'));
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
