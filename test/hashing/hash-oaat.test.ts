import { test } from 'node:test';
import assert from 'node:assert/strict';
import { oaatHash } from '../../src/algorithms/hashing/hash-oaat/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-oaat/trace.ts';
test('OAAT 确定性', () => {
  assert.equal(oaatHash('abc'), oaatHash('abc'));
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
