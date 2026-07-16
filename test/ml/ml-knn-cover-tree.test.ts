import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildCoverTree,
  coverTreeNearest,
  bruteNearest,
} from '../../src/algorithms/ml/ml-knn-cover-tree/impl.ts';
test('覆盖树 与暴力一致', () => {
  const pts = [
    [0, 0],
    [1, 1],
    [5, 5],
    [6, 6],
  ];
  const root = buildCoverTree(pts);
  assert.ok(Math.abs(coverTreeNearest(root, [0.1, 0.1]) - bruteNearest(pts, [0.1, 0.1])) < 1e-9);
});
