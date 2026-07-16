import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bloomDemo } from '../../src/algorithms/hashing/hash-bloom-test/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-bloom-test/trace.ts';
test('已加入元素必返回 true', () => {
  const r = bloomDemo(['a'], ['a'], 64, 3);
  assert.equal(r.fp, 0);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
