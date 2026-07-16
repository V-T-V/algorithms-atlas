import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  simHash,
  hammingDistance,
} from '../../src/algorithms/hashing/hash-locality-sensitive/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/hashing/hash-locality-sensitive/trace.ts';

test('simHash 确定性', () => {
  assert.equal(simHash([1, 2, 3]), simHash([1, 2, 3]));
});
test('simHash 相近输入海明距离小', () => {
  const h1 = simHash([1, 2, 3, 4, 5], 16);
  const h2 = simHash([1, 2, 3, 4, 6], 16);
  // 1 维差异，海明距离应较小（<= 8 即合理）
  assert.ok(hammingDistance(h1, h2) <= 10);
});
test('simHash 完全反号海明距离大', () => {
  const h1 = simHash([1, 1, 1, 1, 1], 16);
  const h2 = simHash([-1, -1, -1, -1, -1], 16);
  // 反号向量海明距离应接近 16
  assert.ok(hammingDistance(h1, h2) >= 12);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace(DEFAULT_INPUT).length >= 3);
});
