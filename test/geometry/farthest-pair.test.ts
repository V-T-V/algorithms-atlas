// 最远点对（旋转卡壳）· 单元测试

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  farthestPair,
  convexHull,
  dist,
  type Point,
} from '../../src/algorithms/geometry/farthest-pair/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/geometry/farthest-pair/trace.ts';

/** 朴素 O(n²) 最远点对（参考）。 */
function bruteFarthest(points: Point[]): { diameter: number; pair: [Point, Point] } {
  let best = -1;
  let pair: [Point, Point] = [points[0]!, points[0]!];
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const d = dist(points[i]!, points[j]!);
      if (d > best) {
        best = d;
        pair = [points[i]!, points[j]!];
      }
    }
  }
  return { diameter: best, pair };
}

test('dist 基础', () => {
  assert.equal(dist({ x: 0, y: 0 }, { x: 3, y: 4 }), 5);
  assert.equal(dist({ x: 1, y: 1 }, { x: 1, y: 1 }), 0);
});

test('convexHull 正方形', () => {
  const hull = convexHull([
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 4, y: 4 },
    { x: 0, y: 4 },
    { x: 2, y: 2 },
  ]);
  assert.equal(hull.length, 4);
});

test('两点退化', () => {
  const r = farthestPair([
    { x: 0, y: 0 },
    { x: 3, y: 4 },
  ]);
  assert.equal(r.diameter, 5);
});

test('正方形点集直径 = 对角线', () => {
  const r = farthestPair([
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 4, y: 4 },
    { x: 0, y: 4 },
  ]);
  assert.ok(Math.abs(r.diameter - Math.hypot(4, 4)) < 1e-9);
});

test('DEFAULT_INPUT 与朴素一致', () => {
  const r = farthestPair(DEFAULT_INPUT.points);
  const ref = bruteFarthest(DEFAULT_INPUT.points);
  assert.ok(Math.abs(r.diameter - ref.diameter) < 1e-9, `${r.diameter} vs ${ref.diameter}`);
});

test('随机点集与朴素一致', () => {
  const pts: Point[] = [];
  for (let i = 0; i < 50; i++) {
    pts.push({ x: (i * 37) % 30, y: (i * 53) % 30 });
  }
  const r = farthestPair(pts);
  const ref = bruteFarthest(pts);
  assert.ok(Math.abs(r.diameter - ref.diameter) < 1e-9);
});

test('内部点不影响直径', () => {
  const outer = farthestPair([
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 10, y: 10 },
    { x: 0, y: 10 },
  ]);
  const withInner = farthestPair([
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 10, y: 10 },
    { x: 0, y: 10 },
    { x: 5, y: 5 },
    { x: 6, y: 4 },
    { x: 4, y: 6 },
  ]);
  assert.ok(Math.abs(outer.diameter - withInner.diameter) < 1e-9);
});

test('共线点退化', () => {
  const r = farthestPair([
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 5, y: 0 },
  ]);
  assert.ok(Math.abs(r.diameter - 5) < 1e-9);
});

test('最远点对都在凸包上', () => {
  const r = farthestPair(DEFAULT_INPUT.points);
  const inHull = (p: Point) => r.hull.some((q) => q.x === p.x && q.y === p.y);
  assert.ok(inHull(r.pair[0]));
  assert.ok(inHull(r.pair[1]));
});

test('钩子触发', () => {
  let hullCalled = false;
  let antipodalCount = 0;
  let doneDiameter = -1;
  farthestPair(DEFAULT_INPUT.points, {
    onHull: () => (hullCalled = true),
    onAntipodal: () => antipodalCount++,
    onDone: (d) => (doneDiameter = d),
  });
  assert.ok(hullCalled);
  assert.ok(antipodalCount >= 1);
  assert.ok(doneDiameter > 0);
});

test('buildTrace 生成至少 4 帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 4, `帧数 ${frames.length} 应 >= 4`);
  for (const f of frames) {
    assert.ok(f.aux === undefined || Array.isArray(f.aux));
  }
});
