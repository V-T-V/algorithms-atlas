import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  miniBatchKMeans,
  mulberry32,
  type Point,
} from '../../src/algorithms/ml/kmeans-mini-batch/impl.ts';

const CLUSTER_A: Point[] = [
  { x: 0, y: 0 },
  { x: 0.5, y: 0 },
  { x: 0, y: 0.5 },
  { x: 0.5, y: 0.5 },
];
const CLUSTER_B: Point[] = [
  { x: 10, y: 10 },
  { x: 10.5, y: 10 },
  { x: 10, y: 10.5 },
  { x: 10.5, y: 10.5 },
];
const CLUSTER_C: Point[] = [
  { x: 20, y: 0 },
  { x: 20.5, y: 0 },
  { x: 20, y: 0.5 },
  { x: 20.5, y: 0.5 },
];

test('miniBatchKMeans: 三簇分离数据正确聚类', () => {
  const points = [...CLUSTER_A, ...CLUSTER_B, ...CLUSTER_C];
  const r = miniBatchKMeans(points, 3, 6, 50, 42);
  assert.equal(r.assignments.length, 12);
  // 同簇点应分到同一编号
  assert.equal(r.assignments[0], r.assignments[1]);
  assert.equal(r.assignments[0], r.assignments[3]);
  assert.equal(r.assignments[4], r.assignments[5]);
  assert.equal(r.assignments[8], r.assignments[9]);
  // 不同簇点应分到不同编号
  assert.notEqual(r.assignments[0], r.assignments[4]);
  assert.notEqual(r.assignments[0], r.assignments[8]);
});

test('miniBatchKMeans: 质心数 = K', () => {
  const r = miniBatchKMeans([...CLUSTER_A, ...CLUSTER_B], 2, 4, 20);
  assert.equal(r.centroids.length, 2);
});

test('miniBatchKMeans: K=1 全部分到同一簇', () => {
  const points = [...CLUSTER_A, ...CLUSTER_B];
  const r = miniBatchKMeans(points, 1, 4, 10);
  assert.ok(r.assignments.every((a) => a === 0));
});

test('miniBatchKMeans: 确定性（同种子结果相同）', () => {
  const points = [...CLUSTER_A, ...CLUSTER_B, ...CLUSTER_C];
  const r1 = miniBatchKMeans(points, 3, 6, 20, 42);
  const r2 = miniBatchKMeans(points, 3, 6, 20, 42);
  assert.deepEqual(r1.assignments, r2.assignments);
  assert.deepEqual(r1.centroids, r2.centroids);
});

test('miniBatchKMeans: 质心落在簇附近', () => {
  const r = miniBatchKMeans([...CLUSTER_A, ...CLUSTER_B], 2, 4, 100, 42);
  // 质心 x 坐标应分别接近 0.25 与 10.25
  const xs = r.centroids.map((c) => c.x).sort((a, b) => a - b);
  assert.ok(Math.abs(xs[0]! - 0.25) < 1, `got ${xs[0]}`);
  assert.ok(Math.abs(xs[1]! - 10.25) < 1, `got ${xs[1]}`);
});

test('miniBatchKMeans: hooks 正确回调', () => {
  const iters: number[] = [];
  let done: unknown = null;
  miniBatchKMeans([...CLUSTER_A, ...CLUSTER_B], 2, 4, 10, 42, {
    onIteration: (iter) => iters.push(iter),
    onDone: (r) => (done = r),
  });
  assert.ok(iters.length > 0);
  assert.ok(done !== null);
});

test('mulberry32: 同种子产生相同序列', () => {
  const a = mulberry32(123);
  const b = mulberry32(123);
  for (let i = 0; i < 10; i++) assert.equal(a(), b());
});

test('miniBatchKMeans: 非法入参抛错', () => {
  assert.throws(() => miniBatchKMeans([...CLUSTER_A], 0), RangeError);
  assert.throws(() => miniBatchKMeans([...CLUSTER_A], 2, 0), RangeError);
  assert.throws(() => miniBatchKMeans([], 1), RangeError);
});
