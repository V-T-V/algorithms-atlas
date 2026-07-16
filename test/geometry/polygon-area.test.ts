import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  polygonArea,
  signedArea,
  type Point,
} from '../../src/algorithms/geometry/polygon-area/impl.ts';

test('矩形面积', () => {
  // 4×3 矩形 = 12
  const rect: Point[] = [
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 4, y: 3 },
    { x: 0, y: 3 },
  ];
  assert.equal(polygonArea(rect), 12);
});

test('三角形面积', () => {
  // 直角三角形 3-4-5 → 面积 6
  const tri: Point[] = [
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 0, y: 3 },
  ];
  assert.equal(polygonArea(tri), 6);
});

test('单位正方形面积 = 1', () => {
  const sq: Point[] = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
  ];
  assert.equal(polygonArea(sq), 1);
});

test('正五边形（外接圆半径 1）面积', () => {
  // 正五边形 R=1 → 面积 = 5/2 · sin(72°) ≈ 2.3776
  const penta: Point[] = [];
  for (let i = 0; i < 5; i++) {
    const ang = (2 * Math.PI * i) / 5;
    penta.push({ x: Math.cos(ang), y: Math.sin(ang) });
  }
  const expected = (5 / 2) * Math.sin((2 * Math.PI) / 5);
  assert.ok(Math.abs(polygonArea(penta) - expected) < 1e-9);
});

test('凸五边形（不规则）已知值', () => {
  const poly: Point[] = [
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 4, y: 3 },
    { x: 2, y: 5 },
    { x: 0, y: 3 },
  ];
  // 手算：鞋带 Σ = (0·0−4·0)+(4·3−4·0)+(4·5−2·3)+(2·3−0·5)+(0·0−0·3)
  //      = 0 + 12 + 14 + 6 + 0 = 32 → 面积 16
  assert.equal(polygonArea(poly), 16);
});

test('顶点顺序不影响面积（CW 与 CCW 结果相同）', () => {
  const ccw: Point[] = [
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 4, y: 3 },
    { x: 0, y: 3 },
  ];
  const cw = [...ccw].reverse();
  assert.equal(polygonArea(ccw), polygonArea(cw));
});

test('signedArea 符号正确', () => {
  const ccw: Point[] = [
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 4, y: 3 },
  ];
  // CCW → 正
  assert.ok(signedArea(ccw) > 0);
  // CW → 负
  assert.ok(signedArea([...ccw].reverse()) < 0);
  assert.equal(signedArea(ccw), -signedArea([...ccw].reverse()));
});

test('退化情形（点数 < 3）面积 0', () => {
  assert.equal(polygonArea([]), 0);
  assert.equal(polygonArea([{ x: 1, y: 1 }]), 0);
  assert.equal(
    polygonArea([
      { x: 0, y: 0 },
      { x: 1, y: 1 },
    ]),
    0,
  );
});

test('平移不变性', () => {
  const a: Point[] = [
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 4, y: 3 },
    { x: 0, y: 3 },
  ];
  const b = a.map((p) => ({ x: p.x + 100, y: p.y - 50 }));
  assert.equal(polygonArea(a), polygonArea(b));
});

test('与三角形剖分（fan）一致', () => {
  // 任意多边形面积 = 以某顶点为扇心的三角形面积之和
  const poly: Point[] = [
    { x: 1, y: 1 },
    { x: 5, y: 1 },
    { x: 6, y: 4 },
    { x: 3, y: 6 },
    { x: 0, y: 3 },
  ];
  const triArea = (a: Point, b: Point, c: Point): number =>
    Math.abs((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)) / 2;
  let fan = 0;
  for (let i = 1; i + 1 < poly.length; i++) {
    fan += triArea(poly[0]!, poly[i]!, poly[i + 1]!);
  }
  assert.ok(Math.abs(polygonArea(poly) - fan) < 1e-9);
});

test('钩子被调用', () => {
  let edge = 0;
  let done = 0;
  polygonArea(
    [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 4, y: 3 },
      { x: 0, y: 3 },
    ],
    {
      onEdge: () => edge++,
      onDone: () => done++,
    },
  );
  assert.equal(edge, 4); // 4 条边
  assert.equal(done, 1);
});

test('buildTrace 产生帧', async () => {
  const { buildTrace } = await import('../../src/algorithms/geometry/polygon-area/trace.ts');
  const frames = buildTrace();
  assert.ok(frames.length > 2);
  assert.ok(frames[frames.length - 1]!.note?.zh);
});
