import { test } from 'node:test';
import assert from 'node:assert/strict';
import { polynomialRollHash } from '../../src/algorithms/hashing/hash-polynomial-roll/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-polynomial-roll/trace.ts';
test('相同字符串哈希相同', () => {
  assert.deepEqual(polynomialRollHash('abc'), polynomialRollHash('abc'));
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
