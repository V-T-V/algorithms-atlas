import { test } from 'node:test';
import assert from 'node:assert/strict';
import { knn, type LabeledPoint } from '../../src/algorithms/ml/knn/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/ml/knn/trace.ts';

const TRAIN: LabeledPoint[] = [
  { x: 0, y: 0, label: 'A' },
  { x: 0.5, y: 0.2, label: 'A' },
  { x: 10, y: 10, label: 'B' },
  { x: 10.5, y: 9.8, label: 'B' },
];

test('knn 查询点靠近 A 类簇 → 预测 A', () => {
  const r = knn(TRAIN, { x: 0.2, y: 0.1 }, { k: 3 });
  assert.equal(r.label, 'A');
  // 最近邻居前两个应是 A
  assert.equal(r.neighbors[0]!.label, 'A');
  assert.equal(r.neighbors[1]!.label, 'A');
});

test('knn 查询点靠近 B 类簇 → 预测 B', () => {
  const r = knn(TRAIN, { x: 10.2, y: 10 }, { k: 3 });
  assert.equal(r.label, 'B');
});

test('knn k=1 取最近单个邻居', () => {
  const r = knn(TRAIN, { x: 9.9, y: 9.9 }, { k: 1 });
  assert.equal(r.label, 'B');
  assert.equal(r.neighbors.length, 1);
  assert.equal(r.neighbors[0]!.index, 2); // (10,10) 最近
});

test('knn k 超过样本数时取全部', () => {
  const r = knn(TRAIN, { x: 0, y: 0 }, { k: 100 });
  assert.equal(r.neighbors.length, TRAIN.length);
  assert.equal(
    Object.values(r.votes).reduce((a, b) => a + b, 0),
    TRAIN.length,
  );
});

test('knn 距离正确（最近邻居索引与距离）', () => {
  const r = knn(TRAIN, { x: 0, y: 0 }, { k: 2 });
  // 最近的应是 t0(0,0) 距离 0
  assert.equal(r.neighbors[0]!.index, 0);
  assert.equal(r.neighbors[0]!.dist, 0);
  // 第二近 t1(0.5,0.2) 距离 = √(0.25+0.04) = √0.29
  assert.equal(r.neighbors[1]!.index, 1);
  assert.ok(Math.abs(r.neighbors[1]!.dist - Math.sqrt(0.29)) < 1e-9);
});

test('knn 票数计数正确', () => {
  const r = knn(TRAIN, { x: 0.2, y: 0.1 }, { k: 3 });
  // 前 3 近：t0(A), t1(A), 然后较近的 B → A:2, B:1
  assert.equal(r.votes['A'], 2);
  assert.equal(r.votes['B'], 1);
});

test('knn 空训练集返回空', () => {
  const r = knn([], { x: 1, y: 1 }, { k: 3 });
  assert.equal(r.label, '');
  assert.equal(r.neighbors.length, 0);
});

test('knn 钩子被调用', () => {
  let distances = 0;
  let votes = 0;
  let results = 0;
  knn(
    TRAIN,
    { x: 0.2, y: 0.1 },
    { k: 3 },
    {
      onDistance: () => distances++,
      onVote: () => votes++,
      onResult: () => results++,
    },
  );
  assert.equal(distances, TRAIN.length);
  assert.equal(votes, 3); // k=3
  assert.equal(results, 1);
});

test('knn onSelectNeighbors 给出 k 个邻居', () => {
  let selected: Array<{ index: number; dist: number }> = [];
  knn(
    TRAIN,
    { x: 5, y: 5 },
    { k: 2 },
    {
      onSelectNeighbors: (nb) => (selected = nb),
    },
  );
  assert.equal(selected.length, 2);
  // 升序
  assert.ok(selected[0]!.dist <= selected[1]!.dist);
});

test('buildTrace 生成 graph 帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  // 所有帧都应有 graph
  for (const f of frames) assert.ok(f.graph, '每帧应有 graph');
  // 查询点 q 存在
  const last = frames[frames.length - 1]!;
  const q = last.graph!.nodes.find((n) => n.id === 'q');
  assert.ok(q);
});

test('buildTrace 终帧含预测类别', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  const last = frames[frames.length - 1]!;
  const pred = last.aux!.find((e) => e.label === '预测类别');
  assert.ok(pred);
  assert.ok(pred!.value.length > 0);
  assert.equal(pred!.role, 'final');
});
