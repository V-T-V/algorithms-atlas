import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pearsonHash } from '../../src/algorithms/hashing/hash-pearson-256/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-pearson-256/trace.ts';
test('Pearson 确定性', () => {
  assert.equal(pearsonHash('abc'), pearsonHash('abc'));
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
