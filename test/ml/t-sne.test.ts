import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tsne, type HighDimPoint } from '../../src/algorithms/ml/t-sne/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/ml/t-sne/trace.ts';

const THREE_CLUSTERS: HighDimPoint[] = [
  [0, 0, 0],
  [0.1, 0.1, 0.1],
  [10, 10, 10],
  [10.1, 9.9, 10.2],
];

test('tsne 输出 2D 嵌入', () => {
  const r = tsne(THREE_CLUSTERS, { maxIterations: 50, seed: 1 });
  assert.equal(r.embedding.length, THREE_CLUSTERS.length);
  for (const p of r.embedding) {
    assert.equal(typeof p.x, 'number');
    assert.equal(typeof p.y, 'number');
  }
});

test('tsne 分离明显的簇', () => {
  const r = tsne(THREE_CLUSTERS, { maxIterations: 500, seed: 1, learningRate: 50 });
  // 前两个点（同簇）距离 < 与后两个点（异簇）的距离
  const dSame = Math.hypot(
    r.embedding[0]!.x - r.embedding[1]!.x,
    r.embedding[0]!.y - r.embedding[1]!.y,
  );
  const dCross = Math.hypot(
    r.embedding[0]!.x - r.embedding[2]!.x,
    r.embedding[0]!.y - r.embedding[2]!.y,
  );
  assert.ok(dCross > dSame, `异簇距离 ${dCross} 应大于同簇距离 ${dSame}`);
});

test('tsne KL 散度为有限数', () => {
  const r = tsne(THREE_CLUSTERS, { maxIterations: 50, seed: 1 });
  assert.ok(Number.isFinite(r.klDivergence));
});

test('tsne 确定性（同种子同结果）', () => {
  const a = tsne(THREE_CLUSTERS, { maxIterations: 30, seed: 7 });
  const b = tsne(THREE_CLUSTERS, { maxIterations: 30, seed: 7 });
  assert.deepEqual(a.embedding, b.embedding);
});

test('tsne 边界：空数据', () => {
  const r = tsne([], { maxIterations: 10 });
  assert.deepEqual(r.embedding, []);
});

test('tsne 钩子被调用', () => {
  let iters = 0;
  tsne(THREE_CLUSTERS, { maxIterations: 20, seed: 1 }, { onIteration: () => iters++ });
  assert.ok(iters >= 10);
});

test('buildTrace 生成 graph 帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
  for (const f of frames) assert.ok(f.graph, '每帧应有 graph');
});
