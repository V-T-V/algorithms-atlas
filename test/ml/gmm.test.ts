import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gmm, type Point } from '../../src/algorithms/ml/gmm/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/ml/gmm/trace.ts';

const CLUSTERS: Point[] = [
  { x: 0, y: 0 },
  { x: 0.1, y: 0.1 },
  { x: -0.1, y: 0.05 },
  { x: 10, y: 10 },
  { x: 10.2, y: 9.8 },
  { x: 9.9, y: 10.1 },
];

test('gmm 把明显分离的两簇正确归类', () => {
  const r = gmm(CLUSTERS, { k: 2, seed: 1 });
  assert.equal(r.assignments.length, 6);
  const g0 = r.assignments[0]!;
  assert.equal(r.assignments[1], g0);
  assert.equal(r.assignments[2], g0);
  const g1 = r.assignments[3]!;
  assert.notEqual(g1, g0);
});

test('gmm 归属概率行和为 1', () => {
  const r = gmm(CLUSTERS, { k: 2, seed: 1 });
  for (const row of r.responsibilities) {
    const sum = row.reduce((s, p) => s + p, 0);
    assert.ok(Math.abs(sum - 1) < 1e-6, `行和应为 1，实际 ${sum}`);
  }
});

test('gmm 权重和为 1', () => {
  const r = gmm(CLUSTERS, { k: 2, seed: 1 });
  const sum = r.components.reduce((s, c) => s + c.weight, 0);
  assert.ok(Math.abs(sum - 1) < 1e-6);
});

test('gmm 对数似然为有限数', () => {
  const r = gmm(CLUSTERS, { k: 2, seed: 1 });
  assert.ok(Number.isFinite(r.logLikelihood));
});

test('gmm 确定性（同种子同结果）', () => {
  const a = gmm(CLUSTERS, { k: 2, seed: 7 });
  const b = gmm(CLUSTERS, { k: 2, seed: 7 });
  assert.deepEqual(a.assignments, b.assignments);
});

test('gmm 边界：空数据 / k=0', () => {
  assert.deepEqual(gmm([], { k: 3 }).components, []);
  assert.deepEqual(gmm(CLUSTERS, { k: 0 }).components, []);
});

test('gmm 钩子被调用', () => {
  let iters = 0;
  let esteps = 0;
  let msteps = 0;
  gmm(
    CLUSTERS,
    { k: 2, seed: 1, maxIterations: 10 },
    {
      onIteration: () => iters++,
      onEStep: () => esteps++,
      onMStep: () => msteps++,
    },
  );
  assert.ok(iters >= 1);
  assert.ok(esteps >= 1);
  assert.ok(msteps >= 1);
});

test('gmm 分量方差为正', () => {
  const r = gmm(CLUSTERS, { k: 2, seed: 1 });
  for (const c of r.components) {
    assert.ok(c.variance.x > 0);
    assert.ok(c.variance.y > 0);
  }
});

test('buildTrace 生成 graph 帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
  for (const f of frames) assert.ok(f.graph, '每帧应有 graph');
  const last = frames[frames.length - 1]!;
  const muNodes = last.graph!.nodes.filter((n) => n.id.startsWith('mu'));
  assert.equal(muNodes.length, DEFAULT_INPUT.k);
});
