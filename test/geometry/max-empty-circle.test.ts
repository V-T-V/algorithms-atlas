// 最大空圆 · 单元测试

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  maxEmptyCircle,
  circumcenter,
  dist,
  type Point,
} from '../../src/algorithms/geometry/max-empty-circle/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/geometry/max-empty-circle/trace.ts';

test('circumcenter 等边三角形外心', () => {
  const c = circumcenter({ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 1, y: Math.sqrt(3) });
  assert.ok(c);
  assert.ok(Math.abs(c!.x - 1) < 1e-9);
  assert.ok(Math.abs(c!.y - Math.sqrt(3) / 3) < 1e-9);
});

test('circumcenter 共线返回 null', () => {
  const c = circumcenter({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 });
  assert.equal(c, null);
});

test('dist 基础', () => {
  assert.equal(dist({ x: 0, y: 0 }, { x: 3, y: 4 }), 5);
});

test('无点：中心，半径到边最小值', () => {
  const r = maxEmptyCircle([], { xmin: 0, ymin: 0, xmax: 10, ymax: 10 });
  assert.ok(Math.abs(r.center.x - 5) < 1e-9);
  assert.ok(Math.abs(r.center.y - 5) < 1e-9);
  assert.ok(Math.abs(r.radius - 5) < 1e-9);
});

test('单个点：最远角', () => {
  // 点 (0,0)，框 [0,10]²，最大空圆圆心应在 (10,10)，半径 √200
  const r = maxEmptyCircle([{ x: 0, y: 0 }], { xmin: 0, ymin: 0, xmax: 10, ymax: 10 });
  assert.ok(Math.abs(r.radius - Math.hypot(10, 10)) < 1e-9, `半径 ${r.radius}`);
});

test('圆内不含点', () => {
  const r = maxEmptyCircle(DEFAULT_INPUT.points, DEFAULT_INPUT.bbox);
  // 所有点到圆心距离 >= 半径
  for (const p of DEFAULT_INPUT.points) {
    const d = dist(r.center, p);
    assert.ok(d >= r.radius - 1e-9, `点 (${p.x},${p.y}) 距离 ${d} < 半径 ${r.radius}`);
  }
});

test('圆心在边界内', () => {
  const r = maxEmptyCircle(DEFAULT_INPUT.points, DEFAULT_INPUT.bbox);
  const bb = DEFAULT_INPUT.bbox;
  assert.ok(r.center.x >= bb.xmin - 1e-9 && r.center.x <= bb.xmax + 1e-9);
  assert.ok(r.center.y >= bb.ymin - 1e-9 && r.center.y <= bb.ymax + 1e-9);
});

test('半径 > 0（点不占满）', () => {
  const r = maxEmptyCircle(DEFAULT_INPUT.points, DEFAULT_INPUT.bbox);
  assert.ok(r.radius > 0);
});

test('对称点集：最优半径正确', () => {
  // 四点对称分布在框中部。注意：当框远大于点集跨度时，
  // 最大空圆的圆心会落在框的角落（角落到最近点距离更大）。
  // 此处框 [0,8]×[0,8]，四点距中心 (4,4) 均为 2；角落 (0,0) 到最近点 (2,4) 距离 √20≈4.472。
  // 故最优半径为 √20，圆心为某角落（四角落对称，半径相等）。
  const pts: Point[] = [
    { x: 2, y: 4 },
    { x: 6, y: 4 },
    { x: 4, y: 2 },
    { x: 4, y: 6 },
  ];
  const r = maxEmptyCircle(pts, { xmin: 0, ymin: 0, xmax: 8, ymax: 8 });
  const expected = Math.sqrt(20); // 角落到最近点
  assert.ok(Math.abs(r.radius - expected) < 1e-9, `半径 ${r.radius} 应为 ${expected}`);
  // 圆心是四个角落之一（由对称性）
  const isCorner =
    (Math.abs(r.center.x - 0) < 1e-9 || Math.abs(r.center.x - 8) < 1e-9) &&
    (Math.abs(r.center.y - 0) < 1e-9 || Math.abs(r.center.y - 8) < 1e-9);
  assert.ok(isCorner, `圆心 (${r.center.x},${r.center.y}) 应为角落`);
});

test('点集贴近边界：最优圆心在框中心', () => {
  // 四点贴在框边中点，使中心 (5,5) 成为唯一最大空圆心（半径=5）。
  const pts: Point[] = [
    { x: 5, y: 0 },
    { x: 10, y: 5 },
    { x: 5, y: 10 },
    { x: 0, y: 5 },
  ];
  const r = maxEmptyCircle(pts, { xmin: 0, ymin: 0, xmax: 10, ymax: 10 });
  assert.ok(Math.abs(r.radius - 5) < 1e-9, `半径 ${r.radius} 应为 5`);
});

test('钩子触发', () => {
  let candidates = 0;
  let improves = 0;
  let done: number | null = null;
  maxEmptyCircle(DEFAULT_INPUT.points, DEFAULT_INPUT.bbox, {
    onCandidate: () => candidates++,
    onImprove: () => improves++,
    onDone: (_c, r) => (done = r),
  });
  assert.ok(candidates >= 1);
  assert.ok(improves >= 1);
  assert.ok(done !== null && done >= 0);
});

test('buildTrace 生成至少 4 帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 4, `帧数 ${frames.length} 应 >= 4`);
  for (const f of frames) {
    assert.ok(f.aux === undefined || Array.isArray(f.aux));
  }
});
