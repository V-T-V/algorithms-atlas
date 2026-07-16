import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  circleTriangle,
  pointInTriangle,
  pointSegDist,
  type Point,
} from '../../src/algorithms/geometry/geo-circle-triangle/impl.ts';

const P = (x: number, y: number): Point => ({ x, y });
const A = P(0, 0),
  B = P(4, 0),
  C = P(2, 4);

test('circleTriangle 圆包含三角形', () => {
  // 大圆覆盖整个三角形
  assert.equal(circleTriangle(P(2, 1), 10, A, B, C), 'circle-contains-triangle');
});

test('circleTriangle 圆心在三角形内 → 相交', () => {
  assert.equal(circleTriangle(P(2, 1), 0.1, A, B, C), 'intersect');
});

test('circleTriangle 相离', () => {
  assert.equal(circleTriangle(P(10, 10), 1, A, B, C), 'disjoint');
});

test('circleTriangle 接触边 → 相交', () => {
  // 圆心 (2,-0.5) 半径 0.6：到边 AB(y=0) 距离 0.5 <= 0.6 → 相交
  assert.equal(circleTriangle(P(2, -0.5), 0.6, A, B, C), 'intersect');
});

test('pointInTriangle 正确', () => {
  assert.equal(pointInTriangle(P(2, 1), A, B, C), true);
  assert.equal(pointInTriangle(P(10, 10), A, B, C), false);
  assert.equal(pointInTriangle(P(0, 0), A, B, C), true); // 顶点
});

test('pointSegDist 正确', () => {
  assert.equal(pointSegDist(P(2, 1), P(0, 0), P(4, 0)), 1);
});
