import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CountingBloom } from '../../src/algorithms/hashing/hash-counting-bloom/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-counting-bloom/trace.ts';
test('删除后元素消失', () => {
  const cbf = new CountingBloom(32, 3);
  cbf.add('x');
  assert.equal(cbf.has('x'), true);
  cbf.remove('x');
  assert.equal(cbf.has('x'), false);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
