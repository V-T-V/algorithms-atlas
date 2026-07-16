// 多边形并集面积 · 单元测试

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  polygonUnionArea,
  sumAreas,
  pointInPolygon,
  polygonArea,
  unionBoundingBox,
  mulberry32,
  type Point,
} from '../../src/algorithms/geometry/polygon-union/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/geometry/polygon-union/trace.ts';

test('pointInPolygon 基础', () => {
  const sq: Point[] = [
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 4, y: 4 },
    { x: 0, y: 4 },
  ];
  assert.equal(pointInPolygon({ x: 2, y: 2 }, sq), true);
  assert.equal(pointInPolygon({ x: 5, y: 5 }, sq), false);
  assert.equal(pointInPolygon({ x: -1, y: 2 }, sq), false);
});

test('polygonArea 鞋带', () => {
  const sq: Point[] = [
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 4, y: 4 },
    { x: 0, y: 4 },
  ];
  assert.ok(Math.abs(polygonArea(sq) - 16) < 1e-9);
});

test('unionBoundingBox', () => {
  const polygons = [
    [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 2 },
      { x: 0, y: 2 },
    ],
    [
      { x: 1, y: 1 },
      { x: 5, y: 1 },
      { x: 5, y: 5 },
      { x: 1, y: 5 },
    ],
  ];
  const bb = unionBoundingBox(polygons)!;
  assert.equal(bb.xmin, 0);
  assert.equal(bb.ymin, 0);
  assert.equal(bb.xmax, 5);
  assert.equal(bb.ymax, 5);
});

test('两个不相交矩形并集面积 ≈ 面积之和', () => {
  const polygons = [
    [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 2 },
      { x: 0, y: 2 },
    ],
    [
      { x: 5, y: 5 },
      { x: 7, y: 5 },
      { x: 7, y: 7 },
      { x: 5, y: 7 },
    ],
  ];
  const r = polygonUnionArea(polygons, 20000, mulberry32(1));
  // 面积和 = 4 + 4 = 8
  assert.ok(Math.abs(r.estimate - 8) < 1.0, `估计 ${r.estimate} 偏离 8`);
});

test('两个重叠矩形并集面积 = 16 + 16 − 6 = 26', () => {
  // [0,4]×[0,4] ∪ [2,6]×[1,5]：重叠区为 [2,4]×[1,4]，面积 2·3=6
  // 故并集 = 16 + 16 − 6 = 26
  const polygons = DEFAULT_INPUT.polygons;
  const r = polygonUnionArea(polygons, 30000, mulberry32(42));
  assert.ok(Math.abs(r.estimate - 26) < 1.5, `估计 ${r.estimate} 偏离 26`);
});

test('sumAreas 不相交情形等于并集', () => {
  const polygons = [
    [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 2 },
      { x: 0, y: 2 },
    ],
    [
      { x: 5, y: 5 },
      { x: 7, y: 5 },
      { x: 7, y: 7 },
      { x: 5, y: 7 },
    ],
  ];
  assert.ok(Math.abs(sumAreas(polygons) - 8) < 1e-9);
});

test('完全包含：大矩形含小矩形，并集 = 大矩形面积', () => {
  const polygons = [
    [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 10 },
    ],
    [
      { x: 2, y: 2 },
      { x: 4, y: 2 },
      { x: 4, y: 4 },
      { x: 2, y: 4 },
    ],
  ];
  const r = polygonUnionArea(polygons, 20000, mulberry32(3));
  assert.ok(Math.abs(r.estimate - 100) < 2.0, `估计 ${r.estimate} 偏离 100`);
});

test('空多边形列表返回 0', () => {
  const r = polygonUnionArea([], 100, mulberry32(1));
  assert.equal(r.estimate, 0);
});

test('同种子可复现', () => {
  const a = polygonUnionArea(DEFAULT_INPUT.polygons, 1000, mulberry32(99));
  const b = polygonUnionArea(DEFAULT_INPUT.polygons, 1000, mulberry32(99));
  assert.deepEqual(a, b);
});

test('钩子触发', () => {
  const samples: boolean[] = [];
  const batches: number[] = [];
  polygonUnionArea(DEFAULT_INPUT.polygons, 100, mulberry32(1), 20, {
    onSample: (_p, hit) => samples.push(hit),
    onBatch: (_e, t) => batches.push(t),
  });
  assert.equal(samples.length, 100);
  assert.equal(batches.length, 5); // 100/20
});

test('buildTrace 生成至少 4 帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 4, `帧数 ${frames.length} 应 >= 4`);
  for (const f of frames) {
    assert.ok(f.aux === undefined || Array.isArray(f.aux));
  }
});

test('DEFAULT_INPUT 两个多边形', () => {
  assert.equal(DEFAULT_INPUT.polygons.length, 2);
});
