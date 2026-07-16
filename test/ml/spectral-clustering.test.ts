import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  spectralClustering,
  type Point,
} from '../../src/algorithms/ml/spectral-clustering/impl.ts';

const CLUSTER_A: Point[] = [
  { x: 0, y: 0 },
  { x: 0.2, y: 0 },
  { x: 0, y: 0.2 },
  { x: 0.2, y: 0.2 },
  { x: 0.1, y: 0.1 },
];
const CLUSTER_B: Point[] = [
  { x: 5, y: 5 },
  { x: 5.2, y: 5 },
  { x: 5, y: 5.2 },
  { x: 5.2, y: 5.2 },
  { x: 5.1, y: 5.1 },
];

test('spectralClustering: 两簇分离数据正确分组', () => {
  const points = [...CLUSTER_A, ...CLUSTER_B];
  const labels = spectralClustering(points, 2, 0.5);
  assert.equal(labels.length, 10);
  // 同簇点同标签
  assert.equal(labels[0], labels[1]);
  assert.equal(labels[0], labels[4]);
  assert.equal(labels[5], labels[6]);
  // 不同簇点不同标签
  assert.notEqual(labels[0], labels[5]);
});

test('spectralClustering: k=1 → 全部同一标签', () => {
  const labels = spectralClustering([...CLUSTER_A, ...CLUSTER_B], 1, 0.5);
  assert.ok(labels.every((l) => l === 0));
});

test('spectralClustering: 标签在 [0, k) 范围内', () => {
  const labels = spectralClustering([...CLUSTER_A, ...CLUSTER_B], 2, 0.5);
  for (const l of labels) assert.ok(l >= 0 && l < 2);
});

test('spectralClustering: 空点集', () => {
  assert.deepEqual(spectralClustering([], 2, 0.5), []);
});

test('spectralClustering: hooks 正确回调', () => {
  let gotEigenvalues = false;
  let gotLaplacian = false;
  let done: unknown = null;
  spectralClustering([...CLUSTER_A, ...CLUSTER_B], 2, 0.5, {
    onLaplacian: () => (gotLaplacian = true),
    onEigenvalues: () => (gotEigenvalues = true),
    onDone: (l) => (done = l),
  });
  assert.ok(gotLaplacian);
  assert.ok(gotEigenvalues);
  assert.ok(done !== null);
});

test('spectralClustering: 非法入参抛错', () => {
  assert.throws(() => spectralClustering([...CLUSTER_A], 0, 0.5), RangeError);
  assert.throws(() => spectralClustering([...CLUSTER_A], 2, 0), RangeError);
  assert.throws(() => spectralClustering([...CLUSTER_A], 2, -1), RangeError);
});
