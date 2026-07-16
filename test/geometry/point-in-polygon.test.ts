import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pointInPolygon, type Point } from '../../src/algorithms/geometry/point-in-polygon/impl.ts';

const square: Point[] = [
  { x: 0, y: 0 },
  { x: 4, y: 0 },
  { x: 4, y: 4 },
  { x: 0, y: 4 },
];

test('点在正方形内部', () => {
  assert.equal(pointInPolygon({ x: 2, y: 2 }, square), true);
});

test('点在正方形外部', () => {
  assert.equal(pointInPolygon({ x: 5, y: 5 }, square), false);
  assert.equal(pointInPolygon({ x: -1, y: 2 }, square), false);
});

test('凹多边形', () => {
  const concave: Point[] = [
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 4, y: 4 },
    { x: 2, y: 2 },
    { x: 0, y: 4 },
  ];
  // 凹槽内的点
  assert.equal(pointInPolygon({ x: 2, y: 3 }, concave), false);
  // 主体内的点
  assert.equal(pointInPolygon({ x: 1, y: 1 }, concave), true);
});

test('三角形', () => {
  const tri: Point[] = [
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 2, y: 4 },
  ];
  assert.equal(pointInPolygon({ x: 2, y: 1 }, tri), true);
  assert.equal(pointInPolygon({ x: 3, y: 3 }, tri), false);
});

test('钩子被调用', () => {
  let checks = 0;
  pointInPolygon({ x: 2, y: 2 }, square, { onCheckEdge: () => checks++ });
  assert.equal(checks, 4);
});
