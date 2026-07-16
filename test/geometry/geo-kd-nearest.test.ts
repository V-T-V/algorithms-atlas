import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildKDTree,
  kdNearest,
  type Point,
} from '../../src/algorithms/geometry/geo-kd-nearest/impl.ts';

const P = (x: number, y: number): Point => ({ x, y });

function bruteNearest(points: Point[], t: Point): Point | null {
  if (points.length === 0) return null;
  let best = points[0]!;
  let bd = Infinity;
  for (const p of points) {
    const d = Math.hypot(p.x - t.x, p.y - t.y);
    if (d < bd) {
      bd = d;
      best = p;
    }
  }
  return best;
}

test('kdNearest 与暴力法一致', () => {
  const pts = [P(1, 1), P(2, 5), P(5, 4), P(7, 2), P(8, 7), P(3, 8)];
  const tree = buildKDTree(pts)!;
  for (const t of [P(4, 3), P(0, 0), P(9, 9), P(3, 6), P(7, 7)]) {
    const a = kdNearest(tree, t);
    const b = bruteNearest(pts, t);
    assert.deepEqual(a, b);
  }
});

test('kdNearest 大规模随机验证', () => {
  const pts: Point[] = [];
  let seed = 5;
  for (let i = 0; i < 200; i++) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    pts.push(P((seed % 1000) / 10, ((seed >> 8) % 1000) / 10));
  }
  const tree = buildKDTree(pts)!;
  for (let q = 0; q < 50; q++) {
    const t = P(q * 2, q * 1.5);
    assert.deepEqual(kdNearest(tree, t), bruteNearest(pts, t));
  }
});

test('kdNearest 空树返回 null', () => {
  assert.equal(kdNearest(null, P(0, 0)), null);
});

test('kdNearest 单点', () => {
  const tree = buildKDTree([P(3, 3)])!;
  assert.deepEqual(kdNearest(tree, P(0, 0)), P(3, 3));
});
