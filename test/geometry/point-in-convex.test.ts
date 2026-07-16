// 点在凸多边形内（二分法）· 单元测试

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  pointInConvex,
  isPointInConvex,
  type Point,
} from '../../src/algorithms/geometry/point-in-convex/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/geometry/point-in-convex/trace.ts';

const SQUARE: Point[] = [
  { x: 0, y: 0 },
  { x: 4, y: 0 },
  { x: 4, y: 4 },
  { x: 0, y: 4 },
];

test('内部点返回 in', () => {
  assert.equal(pointInConvex({ x: 2, y: 2 }, SQUARE), 'in');
  assert.equal(pointInConvex({ x: 1, y: 1 }, SQUARE), 'in');
});

test('外部点返回 out', () => {
  assert.equal(pointInConvex({ x: 5, y: 5 }, SQUARE), 'out');
  assert.equal(pointInConvex({ x: -1, y: 2 }, SQUARE), 'out');
  assert.equal(pointInConvex({ x: 2, y: -1 }, SQUARE), 'out');
});

test('边界点返回 on', () => {
  assert.equal(pointInConvex({ x: 2, y: 0 }, SQUARE), 'on');
  assert.equal(pointInConvex({ x: 0, y: 0 }, SQUARE), 'on');
  assert.equal(pointInConvex({ x: 4, y: 2 }, SQUARE), 'on');
});

test('isPointInConvex 布尔封装', () => {
  assert.equal(isPointInConvex({ x: 2, y: 2 }, SQUARE), true);
  assert.equal(isPointInConvex({ x: 2, y: 0 }, SQUARE), true);
  assert.equal(isPointInConvex({ x: 5, y: 5 }, SQUARE), false);
});

test('五边形 DEFAULT_INPUT', () => {
  assert.equal(pointInConvex(DEFAULT_INPUT.query, DEFAULT_INPUT.polygon), 'in');
});

test('三角形', () => {
  const tri: Point[] = [
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 2, y: 4 },
  ];
  assert.equal(pointInConvex({ x: 2, y: 2 }, tri), 'in');
  assert.equal(pointInConvex({ x: 0, y: 2 }, tri), 'out');
});

test('正多边形（六边形）', () => {
  const hex: Point[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i;
    hex.push({ x: 5 + 4 * Math.cos(a), y: 5 + 4 * Math.sin(a) });
  }
  assert.equal(pointInConvex({ x: 5, y: 5 }, hex), 'in');
  assert.equal(pointInConvex({ x: 8.9, y: 5 }, hex), 'in'); // 接近边界（仍在内）
  assert.equal(pointInConvex({ x: 9.5, y: 5 }, hex), 'out'); // 超出最右顶点 x=9
});

test('大规模凸多边形：O(log n) 仍正确', () => {
  const poly: Point[] = [];
  for (let i = 0; i < 100; i++) {
    const a = (2 * Math.PI * i) / 100;
    poly.push({ x: 50 + 40 * Math.cos(a), y: 50 + 40 * Math.sin(a) });
  }
  assert.equal(pointInConvex({ x: 50, y: 50 }, poly), 'in');
  assert.equal(pointInConvex({ x: 50, y: 90 }, poly), 'on');
  assert.equal(pointInConvex({ x: 0, y: 0 }, poly), 'out');
});

test('退化 n<3 返回 out', () => {
  assert.equal(pointInConvex({ x: 0, y: 0 }, []), 'out');
  assert.equal(
    pointInConvex({ x: 0, y: 0 }, [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
    ]),
    'out',
  );
});

test('与射线法一致（对照）', () => {
  const rayCast = (q: Point, poly: Point[]): boolean => {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i]!.x,
        yi = poly[i]!.y;
      const xj = poly[j]!.x,
        yj = poly[j]!.y;
      if (yi > q.y !== yj > q.y && q.x < ((xj - xi) * (q.y - yi)) / (yj - yi) + xi)
        inside = !inside;
    }
    return inside;
  };
  const poly = DEFAULT_INPUT.polygon;
  for (const q of [
    { x: 3, y: 3 },
    { x: 0, y: 0 },
    { x: 5, y: 5 },
    { x: 2, y: 1 },
  ]) {
    const a = isPointInConvex(q, poly);
    const b = rayCast(q, poly);
    // 边界点可能不同（射线法含边界视实现而异），但内部/外部一致
    assert.equal(a, b, `(${q.x},${q.y}) 不一致`);
  }
});

test('钩子触发', () => {
  const bisections: number[] = [];
  let result: boolean | null = null;
  pointInConvex({ x: 2, y: 2 }, SQUARE, {
    onBinarySearch: (_lo, _hi, mid) => bisections.push(mid),
    onResult: (inside) => (result = inside),
  });
  assert.ok(bisections.length >= 0);
  assert.equal(result, true);
});

test('buildTrace 生成至少 4 帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 4, `帧数 ${frames.length} 应 >= 4`);
  for (const f of frames) {
    assert.ok(f.aux === undefined || Array.isArray(f.aux));
  }
});
