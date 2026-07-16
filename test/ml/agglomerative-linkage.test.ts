import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  agglomerative,
  type Point,
  type Linkage,
} from '../../src/algorithms/ml/agglomerative-linkage/impl.ts';

const POINTS: Point[] = [
  { x: 0, y: 0 },
  { x: 0.5, y: 0 },
  { x: 0, y: 0.5 }, // 簇 0
  { x: 5, y: 5 },
  { x: 5.5, y: 5 },
  { x: 5, y: 5.5 }, // 簇 1
  { x: 10, y: 0 },
  { x: 10.5, y: 0 }, // 簇 2
];

test('agglomerative: 合并数 = n − targetClusters', () => {
  const r = agglomerative(POINTS, 'single', 3);
  assert.equal(r.merges.length, POINTS.length - 3); // 8 - 3 = 5 次合并
});

test('agglomerative: targetClusters=3 正确分出三簇', () => {
  const r = agglomerative(POINTS, 'average', 3);
  assert.equal(r.labels.length, 8);
  // 同簇点同标签
  assert.equal(r.labels[0], r.labels[1]);
  assert.equal(r.labels[0], r.labels[2]);
  assert.equal(r.labels[3], r.labels[4]);
  assert.equal(r.labels[6], r.labels[7]);
  // 不同簇点不同标签
  assert.notEqual(r.labels[0], r.labels[3]);
  assert.notEqual(r.labels[0], r.labels[6]);
  assert.notEqual(r.labels[3], r.labels[6]);
  // 标签数 = 3
  assert.equal(new Set(r.labels).size, 3);
});

test('agglomerative: targetClusters=1 → 全部同标签', () => {
  const r = agglomerative(POINTS, 'single', 1);
  assert.ok(r.labels.every((l) => l === 0));
});

test('agglomerative: targetClusters=n → 每点自成一类（无合并）', () => {
  const r = agglomerative(POINTS, 'single', POINTS.length);
  assert.equal(r.merges.length, 0);
  // 每点标签唯一
  assert.equal(new Set(r.labels).size, POINTS.length);
});

test('agglomerative: 各链接策略都能产生有效聚类', () => {
  const linkages: Linkage[] = ['single', 'complete', 'average', 'centroid'];
  for (const lk of linkages) {
    const r = agglomerative(POINTS, lk, 3);
    assert.equal(new Set(r.labels).size, 3, `${lk} 应分 3 簇`);
  }
});

test('agglomerative: 合并距离单调（单链接保证）', () => {
  const r = agglomerative(POINTS, 'single', 1);
  for (let i = 1; i < r.merges.length; i++) {
    assert.ok(r.merges[i]!.distance >= r.merges[i - 1]!.distance - 1e-9);
  }
});

test('agglomerative: hooks 正确回调', () => {
  const mergeCount: number[] = [];
  let done: unknown = null;
  agglomerative(POINTS, 'average', 3, {
    onMerge: () => mergeCount.push(1),
    onDone: (r) => (done = r),
  });
  assert.equal(mergeCount.length, POINTS.length - 3);
  assert.ok(done !== null);
});

test('agglomerative: 单点输入', () => {
  const r = agglomerative([{ x: 1, y: 1 }], 'single', 1);
  assert.deepEqual(r.labels, [0]);
  assert.equal(r.merges.length, 0);
});

test('agglomerative: 非法 targetClusters 抛错', () => {
  assert.throws(() => agglomerative(POINTS, 'single', 0), RangeError);
  assert.throws(() => agglomerative(POINTS, 'single', POINTS.length + 1), RangeError);
});

test('agglomerative: 空点集', () => {
  assert.deepEqual(agglomerative([], 'single', 1), { merges: [], labels: [] });
});
