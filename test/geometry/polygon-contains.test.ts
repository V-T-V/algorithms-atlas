import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  pointInPolygon,
  pointOnPolygonEdge,
} from '../../src/algorithms/geometry/polygon-contains/impl.ts';

const sq = [
  { x: 0, y: 0 },
  { x: 4, y: 0 },
  { x: 4, y: 4 },
  { x: 0, y: 4 },
];

test('pointInPolygon: 正方形内部点', () => {
  assert.equal(pointInPolygon(sq, { x: 2, y: 2 }), true);
  assert.equal(pointInPolygon(sq, { x: 1, y: 3 }), true);
});

test('pointInPolygon: 正方形外部点', () => {
  assert.equal(pointInPolygon(sq, { x: 5, y: 5 }), false);
  assert.equal(pointInPolygon(sq, { x: -1, y: 2 }), false);
});

test('pointInPolygon: 凹多边形', () => {
  // U 形：底部 (0,0)-(6,0)，两侧向上，中间凹槽
  const u = [
    { x: 0, y: 0 },
    { x: 6, y: 0 },
    { x: 6, y: 5 },
    { x: 4, y: 5 },
    { x: 4, y: 2 },
    { x: 2, y: 2 },
    { x: 2, y: 5 },
    { x: 0, y: 5 },
  ];
  // 凹槽中心 (3,4) 应在外部
  assert.equal(pointInPolygon(u, { x: 3, y: 4 }), false);
  // 底部中心 (3,1) 应在内部
  assert.equal(pointInPolygon(u, { x: 3, y: 1 }), true);
  // 左上角内部 (1,4)
  assert.equal(pointInPolygon(u, { x: 1, y: 4 }), true);
});

test('pointInPolygon: 三角形', () => {
  const tri = [
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 0, y: 4 },
  ];
  assert.equal(pointInPolygon(tri, { x: 1, y: 1 }), true);
  assert.equal(pointInPolygon(tri, { x: 3, y: 3 }), false);
});

test('pointInPolygon: 顺时针/逆时针方向不影响', () => {
  const ccw = sq;
  const cw = [
    { x: 0, y: 0 },
    { x: 0, y: 4 },
    { x: 4, y: 4 },
    { x: 4, y: 0 },
  ];
  assert.equal(pointInPolygon(ccw, { x: 2, y: 2 }), pointInPolygon(cw, { x: 2, y: 2 }));
});

test('pointInPolygon: hooks 正确回调交点计数', () => {
  let crossings: number | null = null;
  let result: boolean | null = null;
  pointInPolygon(
    sq,
    { x: 2, y: 2 },
    {
      onDone: (inside, c) => {
        result = inside;
        crossings = c;
      },
    },
  );
  assert.equal(result, true);
  // 正方形内部点向右只穿过右边缘 1 条（左边缘在点左侧）
  assert.equal(crossings, 1);
});

test('pointInPolygon: 少于 3 顶点返回 false', () => {
  assert.equal(
    pointInPolygon(
      [
        { x: 0, y: 0 },
        { x: 1, y: 1 },
      ],
      { x: 0, y: 0 },
    ),
    false,
  );
});

test('pointOnPolygonEdge: 边上的点', () => {
  assert.equal(pointOnPolygonEdge(sq, { x: 2, y: 0 }), true);
  assert.equal(pointOnPolygonEdge(sq, { x: 4, y: 2 }), true);
  assert.equal(pointOnPolygonEdge(sq, { x: 0, y: 0 }), true);
});

test('pointOnPolygonEdge: 非边上的点', () => {
  assert.equal(pointOnPolygonEdge(sq, { x: 2, y: 2 }), false);
  assert.equal(pointOnPolygonEdge(sq, { x: 5, y: 5 }), false);
});
