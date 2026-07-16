import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kmeans, mulberry32, type Point } from '../../src/algorithms/ml/kmeans/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/ml/kmeans/trace.ts';

const CLUSTERS: Point[] = [
  { x: 0, y: 0 },
  { x: 0.1, y: 0.1 },
  { x: -0.1, y: 0.05 },
  { x: 10, y: 10 },
  { x: 10.2, y: 9.8 },
  { x: 9.9, y: 10.1 },
];

test('kmeans 把明显分离的两簇正确归类', () => {
  const r = kmeans(CLUSTERS, { k: 2, seed: 1 });
  assert.equal(r.assignments.length, 6);
  // 前三个同簇、后三个同簇
  const g0 = r.assignments[0]!;
  assert.equal(r.assignments[1], g0);
  assert.equal(r.assignments[2], g0);
  const g1 = r.assignments[3]!;
  assert.notEqual(g1, g0);
  assert.equal(r.assignments[4], g1);
  assert.equal(r.assignments[5], g1);
});

test('kmeans 收敛', () => {
  const r = kmeans(CLUSTERS, { k: 2, seed: 1, maxIterations: 50 });
  assert.ok(r.converged);
  assert.ok(r.iterations <= 50);
});

test('kmeans 确定性（同种子同结果）', () => {
  const a = kmeans(CLUSTERS, { k: 2, seed: 7 });
  const b = kmeans(CLUSTERS, { k: 2, seed: 7 });
  assert.deepEqual(a.assignments, b.assignments);
  assert.deepEqual(a.centroids, b.centroids);
});

test('kmeans 质心是簇内均值', () => {
  const r = kmeans(CLUSTERS, { k: 2, seed: 1 });
  // 按簇分组计算均值，应等于返回质心（顺序无关）
  for (let c = 0; c < 2; c++) {
    const members = CLUSTERS.filter((_, i) => r.assignments[i] === c);
    const cx = members.reduce((s, p) => s + p.x, 0) / members.length;
    const cy = members.reduce((s, p) => s + p.y, 0) / members.length;
    const centroid = r.centroids.find(
      (cc) => Math.abs(cc.x - cx) < 1e-9 && Math.abs(cc.y - cy) < 1e-9,
    );
    assert.ok(centroid, `应存在均值质心 (${cx}, ${cy})`);
  }
});

test('kmeans 边界：空数据 / k=0', () => {
  assert.deepEqual(kmeans([], { k: 3 }).centroids, []);
  assert.deepEqual(kmeans(CLUSTERS, { k: 0 }).centroids, []);
});

test('kmeans k >= n 时每点一簇', () => {
  const r = kmeans(
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
  // 值在 [0,1)
  for (const v of seqA) assert.ok(v >= 0 && v < 1);
});

test('kmeans 钩子被调用', () => {
  let assigns = 0;
  let updates = 0;
  let iters = 0;
  kmeans(
    CLUSTERS,
    { k: 2, seed: 1 },
    {
      onIteration: () => iters++,
      onAssign: () => assigns++,
      onUpdateCentroid: () => updates++,
    },
  );
  assert.ok(iters >= 1);
  assert.ok(assigns >= 6);
  assert.ok(updates >= 2);
});

test('buildTrace 生成 graph 帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
  // 所有帧都应有 graph
  for (const f of frames) assert.ok(f.graph, '每帧应有 graph');
  // 终帧有质心节点（id 以 c 开头）
  const last = frames[frames.length - 1]!;
  const centroidNodes = last.graph!.nodes.filter((n) => n.id.startsWith('c'));
  assert.equal(centroidNodes.length, DEFAULT_INPUT.k);
});
