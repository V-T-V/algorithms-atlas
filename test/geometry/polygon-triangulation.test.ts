// 多边形三角剖分（耳切法）· 单元测试

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  triangulate,
  type Point,
} from '../../src/algorithms/geometry/polygon-triangulation/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/geometry/polygon-triangulation/trace.ts';

test('三角形返回自身', () => {
  const tri: Point[] = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
  ];
  const r = triangulate(tri);
  assert.equal(r.length, 1);
  assert.deepEqual(r[0], { a: 0, b: 1, c: 2 });
});

test('凸四边形剖分为 2 个三角形', () => {
  // 逆时针正方形
  const sq: Point[] = [
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 4, y: 4 },
    { x: 0, y: 4 },
  ];
  const r = triangulate(sq);
  assert.equal(r.length, 2);
});

test('凹多边形剖分为 n−2 个三角形', () => {
  // 逆时针凹多边形（L 形）
  const poly: Point[] = [
    { x: 0, y: 0 },
    { x: 3, y: 0 },
    { x: 3, y: 1 },
    { x: 1, y: 1 },
    { x: 1, y: 3 },
    { x: 0, y: 3 },
  ];
  const r = triangulate(poly);
  assert.equal(r.length, poly.length - 2);
  assert.equal(r.length, 4);
});

test('星形多边形剖分', () => {
  const r = triangulate(DEFAULT_INPUT.polygon);
  assert.equal(r.length, DEFAULT_INPUT.polygon.length - 2);
});

test('所有三角形顶点索引有效', () => {
  const poly: Point[] = [
    { x: 0, y: 0 },
    { x: 5, y: 0 },
    { x: 5, y: 5 },
    { x: 2, y: 2 },
    { x: 0, y: 5 },
  ];
  const r = triangulate(poly);
  for (const t of r) {
    assert.ok(t.a >= 0 && t.a < poly.length);
    assert.ok(t.b >= 0 && t.b < poly.length);
    assert.ok(t.c >= 0 && t.c < poly.length);
    // 三个互异
    assert.notEqual(t.a, t.b);
    assert.notEqual(t.b, t.c);
    assert.notEqual(t.a, t.c);
  }
});

test('三角形面积之和 = 多边形面积（正方形）', () => {
  const sq: Point[] = [
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 4, y: 4 },
    { x: 0, y: 4 },
  ];
  const r = triangulate(sq);
  let area = 0;
  for (const t of r) {
    const a = sq[t.a]!,
      b = sq[t.b]!,
      c = sq[t.c]!;
    area += Math.abs((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)) / 2;
  }
  assert.ok(Math.abs(area - 16) < 1e-9);
});

test('钩子触发', () => {
  const tests: boolean[] = [];
  const clips: Array<[number, number, number]> = [];
  const sq: Point[] = [
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 4, y: 4 },
    { x: 0, y: 4 },
  ];
  triangulate(sq, {
    onTestEar: (_i, ok) => tests.push(ok),
    onClipEar: (a, b, c) => clips.push([a, b, c]),
  });
  assert.ok(tests.length >= 1);
  assert.equal(clips.length, 1); // 四边形只剪 1 次后剩三角形
});

test('退化：n<3 返回空', () => {
  assert.deepEqual(triangulate([]), []);
  assert.deepEqual(triangulate([{ x: 0, y: 0 }]), []);
  assert.deepEqual(
    triangulate([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
    ]),
    [],
  );
});

test('buildTrace 生成至少 4 帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 4, `帧数 ${frames.length} 应 >= 4`);
  for (const f of frames) {
    assert.ok(f.aux === undefined || Array.isArray(f.aux));
  }
});

test('DEFAULT_INPUT.polygon 是 6 顶点', () => {
  assert.equal(DEFAULT_INPUT.polygon.length, 6);
});
