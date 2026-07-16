import { test } from 'node:test';
import assert from 'node:assert/strict';
import { delaunay } from '../../src/algorithms/geometry/delaunay/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/geometry/delaunay/trace.ts';

test('delaunay 非共圆凸四边形 → 2 个三角形', () => {
  // 非共圆凸四边形：只有两个 Delaunay 三角形
  const { triangles } = delaunay([
    { x: 0, y: 0 },
    { x: 5, y: 0 },
    { x: 5, y: 3 },
    { x: 0, y: 4 },
  ]);
  assert.equal(triangles.length, 2);
});

test('delaunay 共圆正方形 → 4 个三角形', () => {
  // 共圆：空圆性质对每个三元组都成立
  const { triangles } = delaunay([
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 4, y: 4 },
    { x: 0, y: 4 },
  ]);
  assert.equal(triangles.length, 4);
});

test('delaunay 三点 → 1 个三角形', () => {
  const { triangles } = delaunay([
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
  ]);
  assert.equal(triangles.length, 1);
});

test('delaunay 中心点剖分', () => {
  const { triangles } = delaunay([
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 4, y: 4 },
    { x: 0, y: 4 },
    { x: 2, y: 2 },
  ]);
  assert.equal(triangles.length, 4);
});

test('delaunay 钩子触发', () => {
  let checks = 0;
  delaunay(
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
    ],
    { onCheck: () => checks++ },
  );
  assert.ok(checks >= 1);
});

test('buildTrace 含三角形', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
});
