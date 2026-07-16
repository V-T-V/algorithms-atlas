// 直线排列 · 单元测试

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  lineArrangement,
  intersectLines,
  type Line,
} from '../../src/algorithms/geometry/line-arrangement/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/geometry/line-arrangement/trace.ts';

test('intersectLines 基础', () => {
  // x=0.3 与 y=0.6 交于 (0.3, 0.6)
  const p = intersectLines({ a: 1, b: 0, c: 0.3 }, { a: 0, b: 1, c: 0.6 });
  assert.ok(p);
  assert.ok(Math.abs(p!.x - 0.3) < 1e-9);
  assert.ok(Math.abs(p!.y - 0.6) < 1e-9);
});

test('intersectLines 平行返回 null', () => {
  // x=0.3 与 x=0.5 平行
  const p = intersectLines({ a: 1, b: 0, c: 0.3 }, { a: 1, b: 0, c: 0.5 });
  assert.equal(p, null);
});

test('intersectLines 斜交', () => {
  // y=x 与 y=-x+2 交于 (1,1)
  const p = intersectLines({ a: 1, b: -1, c: 0 }, { a: 1, b: 1, c: 2 });
  assert.ok(p);
  assert.ok(Math.abs(p!.x - 1) < 1e-9);
  assert.ok(Math.abs(p!.y - 1) < 1e-9);
});

test('5 条一般位置直线：交点数 = C(5,2)=10', () => {
  // x=0.2, y=0.9, y=x, y=3x+0.1, x+2y=1.5 —— 无平行、无三线共点
  const lines: Line[] = [
    { a: 1, b: 0, c: 0.2 },
    { a: 0, b: 1, c: 0.9 },
    { a: 1, b: -1, c: 0 },
    { a: 3, b: -1, c: -0.1 },
    { a: 1, b: 2, c: 1.5 },
  ];
  const r = lineArrangement(lines);
  assert.equal(r.intersections.length, 10);
  assert.equal(r.vertexCount, 10);
});

test('面数 = n(n+1)/2 + 1', () => {
  const lines: Line[] = [
    { a: 1, b: 0, c: 0.3 },
    { a: 0, b: 1, c: 0.6 },
    { a: 1, b: -1, c: 0 },
    { a: 1, b: 1, c: 0.8 },
  ];
  const r = lineArrangement(lines);
  assert.equal(r.faceCount, (4 * 5) / 2 + 1);
  assert.equal(r.faceCount, 11);
});

test('边数 = n²', () => {
  const lines: Line[] = [
    { a: 1, b: 0, c: 0.3 },
    { a: 0, b: 1, c: 0.6 },
    { a: 1, b: -1, c: 0 },
  ];
  const r = lineArrangement(lines);
  assert.equal(r.edgeCount, 9);
});

test('平行线被正确排除（交点数减少）', () => {
  const lines: Line[] = [
    { a: 1, b: 0, c: 0.3 },
    { a: 1, b: 0, c: 0.5 }, // 平行
    { a: 0, b: 1, c: 0.6 },
  ];
  const r = lineArrangement(lines);
  // 平行对无交点，故只有 2 个交点（每条 x 线与 y 线）
  assert.equal(r.intersections.length, 2);
});

test('钩子触发', () => {
  const lines: Line[] = [
    { a: 1, b: 0, c: 0.3 },
    { a: 0, b: 1, c: 0.6 },
    { a: 1, b: -1, c: 0 },
  ];
  const pairs: Array<[number, number]> = [];
  lineArrangement(lines, {
    onIntersect: (i, j) => pairs.push([i, j]),
  });
  assert.equal(pairs.length, 3);
});

test('buildTrace 生成至少 4 帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 4, `帧数 ${frames.length} 应 >= 4`);
  for (const f of frames) {
    assert.ok(f.aux === undefined || Array.isArray(f.aux));
  }
});

test('DEFAULT_INPUT.lines 长度为 5', () => {
  assert.equal(DEFAULT_INPUT.lines.length, 5);
});
