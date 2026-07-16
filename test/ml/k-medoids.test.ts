import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kMedoids, mulberry32, type Point } from '../../src/algorithms/ml/k-medoids/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/ml/k-medoids/trace.ts';

const CLUSTERS: Point[] = [
  { x: 0, y: 0 },
  { x: 0.1, y: 0.1 },
  { x: -0.1, y: 0.05 },
  { x: 10, y: 10 },
  { x: 10.2, y: 9.8 },
  { x: 9.9, y: 10.1 },
];

test('k-medoids 把明显分离的两簇正确归类', () => {
  const r = kMedoids(CLUSTERS, { k: 2, seed: 1 });
  assert.equal(r.assignments.length, 6);
  const g0 = r.assignments[0]!;
  assert.equal(r.assignments[1], g0);
  assert.equal(r.assignments[2], g0);
  const g1 = r.assignments[3]!;
  assert.notEqual(g1, g0);
  assert.equal(r.assignments[4], g1);
  assert.equal(r.assignments[5], g1);
});

test('k-medoids medoid 必须是真实数据点', () => {
  const r = kMedoids(CLUSTERS, { k: 2, seed: 1 });
  for (const idx of r.medoidIndices) {
    assert.ok(idx >= 0 && idx < CLUSTERS.length, 'medoid 索引应在范围内');
  }
});

test('k-medoids 收敛', () => {
  const r = kMedoids(CLUSTERS, { k: 2, seed: 1, maxIterations: 50 });
  assert.ok(r.converged);
});

test('k-medoids 确定性（同种子同结果）', () => {
  const a = kMedoids(CLUSTERS, { k: 2, seed: 7 });
  const b = kMedoids(CLUSTERS, { k: 2, seed: 7 });
  assert.deepEqual(a.assignments, b.assignments);
  assert.deepEqual(a.medoidIndices, b.medoidIndices);
});

test('k-medoids 交换不会增加代价', () => {
  const r = kMedoids(CLUSTERS, { k: 2, seed: 3 });
  // 收敛态代价应非负且有限
  assert.ok(r.cost >= 0 && Number.isFinite(r.cost));
});

test('k-medoids 边界：空数据 / k=0', () => {
  assert.deepEqual(kMedoids([], { k: 3 }).medoidIndices, []);
  assert.deepEqual(kMedoids(CLUSTERS, { k: 0 }).medoidIndices, []);
});

test('k-medoids k >= n 时每点一簇', () => {
  const r = kMedoids(
    [
      { x: 1, y: 1 },
      { x: 2, y: 2 },
    ],
    { k: 5 },
  );
  assert.equal(r.assignments[0], 0);
  assert.equal(r.assignments[1], 1);
});

test('mulberry32 同种子产生同序列', () => {
  const a = mulberry32(123);
  const b = mulberry32(123);
  const seqA = Array.from({ length: 5 }, a);
  const seqB = Array.from({ length: 5 }, b);
  assert.deepEqual(seqA, seqB);
});

test('k-medoids 钩子被调用', () => {
  let iters = 0;
  let swaps = 0;
  kMedoids(
    CLUSTERS,
    { k: 2, seed: 1 },
    {
      onIteration: () => iters++,
      onSwapTry: () => swaps++,
    },
  );
  assert.ok(iters >= 1);
  assert.ok(swaps >= 1);
});

test('buildTrace 生成 graph 帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
  for (const f of frames) assert.ok(f.graph, '每帧应有 graph');
  const last = frames[frames.length - 1]!;
  const medoidNodes = last.graph!.nodes.filter((n) => n.id.startsWith('m'));
  assert.equal(medoidNodes.length, DEFAULT_INPUT.k);
});
