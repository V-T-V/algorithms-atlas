import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  QuadTree,
  type QPoint,
  type Rect,
} from '../../src/algorithms/ds/ds-quad-tree-range/impl.ts';

const naive = (pts: QPoint[], r: Rect): QPoint[] =>
  pts.filter((p) => p.x >= r.x0 && p.x <= r.x1 && p.y >= r.y0 && p.y <= r.y1);

test('QuadTree 基本', () => {
  const region = { x0: 0, y0: 0, x1: 63, y1: 63 };
  const qt = new QuadTree(region);
  const pts: QPoint[] = [
    { x: 5, y: 5, value: 1 },
    { x: 50, y: 50, value: 2 },
    { x: 30, y: 30, value: 3 },
    { x: 10, y: 40, value: 4 },
    { x: 45, y: 10, value: 5 },
  ];
  for (const p of pts) qt.insert(p);
  const q = { x0: 0, y0: 0, x1: 31, y1: 31 };
  const result = qt.rangeQuery(q);
  const expected = naive(pts, q);
  assert.equal(result.length, expected.length);
});

test('QuadTree 区域全包含', () => {
  const region = { x0: 0, y0: 0, x1: 100, y1: 100 };
  const qt = new QuadTree(region);
  const pts: QPoint[] = [];
  for (let i = 0; i < 20; i++) pts.push({ x: i * 5, y: i * 5, value: i });
  for (const p of pts) qt.insert(p);
  // 全区域
  const result = qt.rangeQuery({ x0: 0, y0: 0, x1: 100, y1: 100 });
  assert.equal(result.length, 20);
});

test('QuadTree 无相交', () => {
  const qt = new QuadTree({ x0: 0, y0: 0, x1: 63, y1: 63 });
  for (const p of [
    { x: 5, y: 5, value: 1 },
    { x: 10, y: 10, value: 2 },
  ])
    qt.insert(p);
  const result = qt.rangeQuery({ x0: 40, y0: 40, x1: 60, y1: 60 });
  assert.equal(result.length, 0);
});

test('QuadTree 触发分裂', () => {
  // CAPACITY=4，插入 5+ 点应触发分裂
  const qt = new QuadTree({ x0: 0, y0: 0, x1: 63, y1: 63 });
  for (let i = 0; i < 20; i++) qt.insert({ x: i, y: i, value: i });
  const all = qt.rangeQuery({ x0: 0, y0: 0, x1: 63, y1: 63 });
  assert.equal(all.length, 20);
});

test('QuadTree 与朴素对照（随机）', () => {
  const region = { x0: 0, y0: 0, x1: 255, y1: 255 };
  const qt = new QuadTree(region);
  const pts: QPoint[] = [];
  for (let i = 0; i < 100; i++) {
    const p = { x: Math.floor(Math.random() * 256), y: Math.floor(Math.random() * 256), value: i };
    pts.push(p);
    qt.insert(p);
  }
  const queries: Rect[] = [
    { x0: 0, y0: 0, x1: 127, y1: 127 },
    { x0: 50, y0: 50, x1: 200, y1: 200 },
    { x0: 100, y0: 100, x1: 150, y1: 150 },
    { x0: 0, y0: 0, x1: 255, y1: 255 },
  ];
  for (const q of queries) {
    const result = qt
      .rangeQuery(q)
      .map((p) => p.value)
      .sort((a, b) => a - b);
    const expected = naive(pts, q)
      .map((p) => p.value)
      .sort((a, b) => a - b);
    assert.deepEqual(result, expected);
  }
});

test('QuadTree 边界点', () => {
  const qt = new QuadTree({ x0: 0, y0: 0, x1: 63, y1: 63 });
  qt.insert({ x: 0, y: 0, value: 1 });
  qt.insert({ x: 63, y: 63, value: 2 });
  const r1 = qt.rangeQuery({ x0: 0, y0: 0, x1: 0, y1: 0 });
  assert.equal(r1.length, 1);
  assert.equal(r1[0]!.value, 1);
  const r2 = qt.rangeQuery({ x0: 63, y0: 63, x1: 63, y1: 63 });
  assert.equal(r2.length, 1);
  assert.equal(r2[0]!.value, 2);
});
