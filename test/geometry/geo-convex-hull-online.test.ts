import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  onlineConvexHull,
  jarvisMarch,
  inConvexHull,
  type Point,
} from '../../src/algorithms/geometry/geo-convex-hull-online/impl.ts';

const P = (x: number, y: number): Point => ({ x, y });

test('onlineConvexHull 正方形 + 内部点', () => {
  const pts = [P(0, 0), P(4, 0), P(4, 4), P(0, 4), P(2, 2)];
  const hull = onlineConvexHull(pts);
  assert.equal(hull.length, 4);
  // 内部点 (2,2) 不在凸包上
  assert.ok(!hull.some((p) => p.x === 2 && p.y === 2));
});

test('onlineConvexHull 逐步加入扩大凸包', () => {
  const pts = [P(0, 0), P(2, 0), P(2, 2), P(0, 2), P(5, 5)];
  const hull = onlineConvexHull(pts);
  assert.ok(hull.some((p) => p.x === 5 && p.y === 5));
});

test('jarvisMarch 已知值', () => {
  const pts = [P(0, 0), P(4, 0), P(4, 4), P(0, 4), P(2, 2)];
  const hull = jarvisMarch(pts);
  assert.equal(hull.length, 4);
});

test('inConvexHull 判定', () => {
  const sq = [P(0, 0), P(4, 0), P(4, 4), P(0, 4)]; // 顺序视作 CCW
  assert.equal(inConvexHull(P(2, 2), sq), true);
  assert.equal(inConvexHull(P(5, 5), sq), false);
});

test('onlineConvexHull 少于 3 点', () => {
  assert.equal(onlineConvexHull([P(0, 0), P(1, 1)]).length, 2);
});
