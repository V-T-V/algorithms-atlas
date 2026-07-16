import { test } from 'node:test';
import assert from 'node:assert/strict';
import { silhouette } from '../../src/algorithms/ml/ml-kmeans-silhouette/impl.ts';
test('轮廓系数 完美聚类接近1', () => {
  assert.ok(
    silhouette(
      [
        [0, 0],
        [0.1, 0.1],
        [5, 5],
        [5.1, 5.1],
      ],
      [0, 0, 1, 1],
    ).score > 0.7,
  );
});
test('轮廓系数 单簇为0', () => {
  assert.ok(
    Math.abs(
      silhouette(
        [
          [0, 0],
          [1, 1],
        ],
        [0, 0],
      ).score,
    ) < 1e-9,
  );
});
