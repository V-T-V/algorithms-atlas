import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildKdTree,
  nearestNeighbor,
  realDistance,
  type Point,
} from '../../src/algorithms/ds/ds-kd-tree-nearest/impl.ts';

const dist2 = (a: Point, b: Point): number => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
};

test('kd-tree 最近邻基本', () => {
  const points = [
    { x: 2, y: 3 },
    { x: 5, y: 4 },
    { x: 9, y: 6 },
    { x: 4, y: 7 },
    { x: 8, y: 1 },
    { x: 7, y: 2 },
  ];
  const tree = buildKdTree(points);
  const target = { x: 6, y: 3 };
  const result = nearestNeighbor(tree, target);
  // 朴素找最小距离
  let bd = Infinity;
  for (const p of points) {
    const d = dist2(p, target);
    if (d < bd) bd = d;
  }
  // 距离应一致（可能有并列最近点，不比较具体哪个点）
  assert.equal(result.dist, bd);
  assert.equal(dist2(result.point!, target), bd);
});

test('kd-tree 空点集', () => {
  const tree = buildKdTree([]);
  const result = nearestNeighbor(tree, { x: 0, y: 0 });
  assert.equal(result.point, null);
  assert.equal(result.dist, Infinity);
});

test('kd-tree 单点', () => {
  const tree = buildKdTree([{ x: 1, y: 1 }]);
  const result = nearestNeighbor(tree, { x: 5, y: 5 });
  assert.deepEqual(result.point, { x: 1, y: 1 });
});

test('kd-tree 目标本身在集合中', () => {
  const points = [
    { x: 1, y: 1 },
    { x: 5, y: 5 },
    { x: 9, y: 9 },
  ];
  const tree = buildKdTree(points);
  const result = nearestNeighbor(tree, { x: 5, y: 5 });
  assert.deepEqual(result.point, { x: 5, y: 5 });
  assert.equal(result.dist, 0);
});

test('kd-tree 与朴素对照（随机）', () => {
  const points: Point[] = [];
  for (let i = 0; i < 50; i++) {
    points.push({ x: Math.floor(Math.random() * 100), y: Math.floor(Math.random() * 100) });
  }
  const tree = buildKdTree(points);
  const targets: Point[] = [];
  for (let i = 0; i < 20; i++) {
    targets.push({ x: Math.floor(Math.random() * 100), y: Math.floor(Math.random() * 100) });
  }
  for (const t of targets) {
    const result = nearestNeighbor(tree, t);
    let bd = Infinity;
    let _best: Point | null = null;
    for (const p of points) {
      const d = dist2(p, t);
      if (d < bd) {
        bd = d;
        _best = p;
      }
    }
    assert.equal(result.dist, bd);
    assert.equal(dist2(result.point!, t), bd);
  }
});

test('realDistance 开方', () => {
  const points = [
    { x: 0, y: 0 },
    { x: 3, y: 4 },
  ];
  const tree = buildKdTree(points);
  const r = nearestNeighbor(tree, { x: 3, y: 4 });
  assert.equal(realDistance(r), 0);
  const r2 = nearestNeighbor(tree, { x: 0, y: 0 });
  assert.equal(realDistance(r2), 0);
});
