// 动态凸包（增量）· 单元测试

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  DynamicConvexHull,
  type Point,
} from '../../src/algorithms/geometry/convex-hull-dynamic/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/geometry/convex-hull-dynamic/trace.ts';

/** 点集的凸包顶点数（朴素参考：Andrew 单调链）。 */
function refHullCount(points: Point[]): number {
  if (points.length < 3) return points.length;
  const pts = [...points].sort((a, b) => a.x - b.x || a.y - b.y);
  const cross = (o: Point, a: Point, b: Point) =>
    (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const lower: Point[] = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2]!, lower[lower.length - 1]!, p) <= 0)
      lower.pop();
    lower.push(p);
  }
  const upper: Point[] = [];
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i]!;
    while (upper.length >= 2 && cross(upper[upper.length - 2]!, upper[upper.length - 1]!, p) <= 0)
      upper.pop();
    upper.push(p);
  }
  return lower.length + upper.length - 2;
}

test('单点', () => {
  const dch = new DynamicConvexHull();
  dch.add({ x: 1, y: 1 });
  assert.equal(dch.getHull().length, 1);
});

test('三点三角形', () => {
  const dch = new DynamicConvexHull();
  dch.add({ x: 0, y: 0 });
  dch.add({ x: 4, y: 0 });
  dch.add({ x: 0, y: 4 });
  assert.equal(dch.getHull().length, 3);
});

test('正方形点集凸包 4 顶点', () => {
  const dch = new DynamicConvexHull();
  for (const p of [
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 4, y: 4 },
    { x: 0, y: 4 },
    { x: 2, y: 2 },
  ]) {
    dch.add(p);
  }
  assert.equal(dch.getHull().length, 4);
});

test('内部点不影响凸包', () => {
  const dch = new DynamicConvexHull();
  for (const p of [
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 10, y: 10 },
    { x: 0, y: 10 },
  ]) {
    dch.add(p);
  }
  const before = dch.getHull().length;
  dch.add({ x: 5, y: 5 }); // 内部点
  assert.equal(dch.getHull().length, before);
});

test('DEFAULT_INPUT 与参考一致', () => {
  const dch = new DynamicConvexHull();
  for (const p of DEFAULT_INPUT.points) dch.add(p);
  const expected = refHullCount(DEFAULT_INPUT.points);
  assert.equal(dch.getHull().length, expected);
});

test('随机点序：与参考一致', () => {
  const pts: Point[] = [];
  for (let i = 0; i < 30; i++) {
    pts.push({ x: Math.floor((i * 37) % 50), y: Math.floor((i * 53) % 50) });
  }
  const dch = new DynamicConvexHull();
  for (const p of pts) dch.add(p);
  // 去重后参考
  const unique: Point[] = [];
  const seen = new Set<string>();
  for (const p of pts) {
    const k = `${p.x},${p.y}`;
    if (!seen.has(k)) {
      seen.add(k);
      unique.push(p);
    }
  }
  assert.equal(dch.getHull().length, refHullCount(unique));
});

test('凸包逆时针顺序（首尾不重复）', () => {
  const dch = new DynamicConvexHull();
  for (const p of [
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 4, y: 4 },
    { x: 0, y: 4 },
  ]) {
    dch.add(p);
  }
  const hull = dch.getHull();
  // 无重复
  const s = new Set(hull.map((p) => `${p.x},${p.y}`));
  assert.equal(s.size, hull.length);
});

test('钩子触发', () => {
  const adds: Point[] = [];
  const insides: Point[] = [];
  const afters: Point[][] = [];
  const dch = new DynamicConvexHull({
    onAddPoint: (p) => adds.push(p),
    onInside: (p) => insides.push(p),
    onAfterInsert: (h) => afters.push([...h]),
  });
  dch.add({ x: 0, y: 0 });
  dch.add({ x: 4, y: 0 });
  dch.add({ x: 4, y: 4 });
  dch.add({ x: 0, y: 4 });
  dch.add({ x: 2, y: 2 }); // 内部
  assert.equal(adds.length, 5);
  assert.equal(insides.length, 1);
  assert.equal(afters.length, 5);
});

test('buildTrace 生成至少 4 帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 4, `帧数 ${frames.length} 应 >= 4`);
  for (const f of frames) {
    assert.ok(f.aux === undefined || Array.isArray(f.aux));
  }
});
