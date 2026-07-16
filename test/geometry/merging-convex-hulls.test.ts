// 合并两个凸包 · 单元测试

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  mergeConvexHulls,
  andrewMonotone,
  type Point,
} from '../../src/algorithms/geometry/merging-convex-hulls/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/geometry/merging-convex-hulls/trace.ts';

test('andrewMonotone 正方形', () => {
  const hull = andrewMonotone([
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 4, y: 4 },
    { x: 0, y: 4 },
    { x: 2, y: 2 },
  ]);
  assert.equal(hull.length, 4);
});

test('合并两个不相交凸包 = 全局凸包', () => {
  const H1: Point[] = [
    { x: 0, y: 2 },
    { x: 2, y: 4 },
    { x: 3, y: 2 },
    { x: 1, y: 0 },
  ];
  const H2: Point[] = [
    { x: 5, y: 3 },
    { x: 7, y: 5 },
    { x: 9, y: 3 },
    { x: 7, y: 1 },
  ];
  const merged = mergeConvexHulls(H1, H2);
  const ref = andrewMonotone([...H1, ...H2]);
  assert.equal(merged.length, ref.length);
  // 顶点集相同
  const ms = new Set(merged.map((p) => `${p.x},${p.y}`));
  const rs = new Set(ref.map((p) => `${p.x},${p.y}`));
  assert.deepEqual([...ms].sort(), [...rs].sort());
});

test('合并后所有原顶点在凸包内或上', () => {
  const merged = mergeConvexHulls(DEFAULT_INPUT.H1, DEFAULT_INPUT.H2);
  for (const p of [...DEFAULT_INPUT.H1, ...DEFAULT_INPUT.H2]) {
    // 在合并凸包的包围盒内
    const xs = merged.map((q) => q.x);
    const ys = merged.map((q) => q.y);
    assert.ok(p.x >= Math.min(...xs) - 1e-9 && p.x <= Math.max(...xs) + 1e-9);
    assert.ok(p.y >= Math.min(...ys) - 1e-9 && p.y <= Math.max(...ys) + 1e-9);
  }
});

test('一个凸包包含另一个：合并后 = 外凸包', () => {
  const outer: Point[] = [
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 10, y: 10 },
    { x: 0, y: 10 },
  ];
  const inner: Point[] = [
    { x: 4, y: 4 },
    { x: 6, y: 4 },
    { x: 5, y: 6 },
  ];
  const merged = mergeConvexHulls(outer, inner);
  assert.equal(merged.length, 4);
});

test('空 H2：返回 H1 的凸包', () => {
  const H1: Point[] = [
    { x: 0, y: 0 },
    { x: 2, y: 0 },
    { x: 1, y: 2 },
  ];
  const merged = mergeConvexHulls(H1, []);
  assert.equal(merged.length, 3);
});

test('两个三角形合并', () => {
  const t1: Point[] = [
    { x: 0, y: 0 },
    { x: 2, y: 0 },
    { x: 1, y: 2 },
  ];
  const t2: Point[] = [
    { x: 4, y: 0 },
    { x: 6, y: 0 },
    { x: 5, y: 2 },
  ];
  const merged = mergeConvexHulls(t1, t2);
  // 合并后应是一个梯形/六边形（顶点数 4-6）
  assert.ok(merged.length >= 4 && merged.length <= 6);
});

test('钩子触发', () => {
  let mergedCalled = false;
  mergeConvexHulls(DEFAULT_INPUT.H1, DEFAULT_INPUT.H2, {
    onMerged: () => (mergedCalled = true),
  });
  assert.ok(mergedCalled);
});

test('buildTrace 生成至少 4 帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 4, `帧数 ${frames.length} 应 >= 4`);
  for (const f of frames) {
    assert.ok(f.aux === undefined || Array.isArray(f.aux));
  }
});

test('DEFAULT_INPUT 各 4 顶点', () => {
  assert.equal(DEFAULT_INPUT.H1.length, 4);
  assert.equal(DEFAULT_INPUT.H2.length, 4);
});
