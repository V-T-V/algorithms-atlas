import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  convexHull,
  polygonArea,
  convexHullArea,
} from '../../src/algorithms/geometry/convex-hull-area/impl.ts';

const close = (a: number, b: number, eps = 1e-9): boolean => Math.abs(a - b) < eps;

test('convexHull: 正方形四角 + 内部点 → 4 顶点', () => {
  const pts = [
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 4, y: 4 },
    { x: 0, y: 4 },
    { x: 2, y: 2 },
  ];
  const hull = convexHull(pts);
  assert.equal(hull.length, 4);
});

test('convexHullArea: 正方形 = 16', () => {
  const pts = [
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 4, y: 4 },
    { x: 0, y: 4 },
    { x: 2, y: 2 },
  ];
  assert.ok(close(convexHullArea(pts), 16));
});

test('convexHullArea: 内部点不影响面积', () => {
  const outer = [
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 4, y: 4 },
    { x: 0, y: 4 },
  ];
  const withInner = [...outer, { x: 1, y: 1 }, { x: 3, y: 3 }, { x: 2, y: 2 }];
  assert.ok(close(convexHullArea(outer), convexHullArea(withInner)));
});

test('convexHullArea: 三角形 = ½·底·高', () => {
  const pts = [
    { x: 0, y: 0 },
    { x: 6, y: 0 },
    { x: 0, y: 4 },
    { x: 1, y: 1 },
  ];
  assert.ok(close(convexHullArea(pts), 12));
});

test('polygonArea: 已知多边形', () => {
  // 单位正方形
  assert.ok(
    close(
      polygonArea([
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 0, y: 1 },
      ]),
      1,
    ),
  );
  // 三角形 (0,0),(4,0),(0,3) → 6
  assert.ok(
    close(
      polygonArea([
        { x: 0, y: 0 },
        { x: 4, y: 0 },
        { x: 0, y: 3 },
      ]),
      6,
    ),
  );
});

test('polygonArea: 顺时针/逆时针都得正数', () => {
  const ccw = [
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 4, y: 4 },
    { x: 0, y: 4 },
  ];
  const cw = [
    { x: 0, y: 0 },
    { x: 0, y: 4 },
    { x: 4, y: 4 },
    { x: 4, y: 0 },
  ];
  assert.ok(close(polygonArea(ccw), polygonArea(cw)));
});

test('convexHullArea: 共线点不影响', () => {
  const pts = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 2, y: 2 },
    { x: 0, y: 2 },
  ];
  assert.ok(close(convexHullArea(pts), 4));
});

test('convexHullArea: hooks 正确回调', () => {
  let hull: unknown = null;
  let area: number | null = null;
  convexHullArea(
    [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 0, y: 2 },
    ],
    {
      onHull: (h) => (hull = h),
      onArea: (a) => (area = a),
    },
  );
  assert.ok(hull !== null);
  assert.ok(close(area!, 2));
});

test('convexHullArea: 少于 3 点面积为 0', () => {
  assert.equal(
    convexHullArea([
      { x: 0, y: 0 },
      { x: 1, y: 1 },
    ]),
    0,
  );
});
