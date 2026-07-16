import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cosineSimilarity } from '../../src/algorithms/ml/ml-cosine-sim/impl.ts';
test('余弦 相同方向=1', () => {
  assert.ok(Math.abs(cosineSimilarity([1, 2], [2, 4]) - 1) < 1e-9);
});
test('余弦 垂直=0', () => {
  assert.ok(Math.abs(cosineSimilarity([1, 0], [0, 1])) < 1e-9);
});
