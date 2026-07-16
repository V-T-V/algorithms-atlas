import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildRTree,
  rangeQuery,
  type RRect,
  type Rect,
} from '../../src/algorithms/ds/ds-r-tree-range/impl.ts';

const intersect = (a: Rect, b: Rect): boolean =>
  !(a.x1 < b.x0 || b.x1 < a.x0 || a.y1 < b.y0 || b.y1 < a.y0);

const naive = (items: RRect[], q: Rect): RRect[] => items.filter((it) => intersect(it, q));

test('R-tree 基本', () => {
  const items: RRect[] = [
    { x0: 0, y0: 0, x1: 5, y1: 5, value: 1 },
    { x0: 10, y0: 10, x1: 15, y1: 15, value: 2 },
    { x0: 20, y0: 0, x1: 25, y1: 5, value: 3 },
    { x0: 0, y0: 20, x1: 5, y1: 25, value: 4 },
  ];
  const tree = buildRTree(items);
  const q = { x0: 0, y0: 0, x1: 12, y1: 12 };
  const result = rangeQuery(tree, q);
  const expected = naive(items, q);
  assert.equal(result.length, expected.length);
  assert.deepEqual(
    result.map((r) => r.value).sort((a, b) => a - b),
    expected.map((r) => r.value).sort((a, b) => a - b),
  );
});

test('R-tree 空集', () => {
  const tree = buildRTree([]);
  assert.equal(tree, null);
  assert.deepEqual(rangeQuery(tree, { x0: 0, y0: 0, x1: 10, y1: 10 }), []);
});

test('R-tree 单项', () => {
  const tree = buildRTree([{ x0: 0, y0: 0, x1: 5, y1: 5, value: 1 }]);
  const r = rangeQuery(tree, { x0: 0, y0: 0, x1: 3, y1: 3 });
  assert.equal(r.length, 1);
  assert.equal(r[0]!.value, 1);
});

test('R-tree 全包含查询', () => {
  const items: RRect[] = [];
  for (let i = 0; i < 10; i++) items.push({ x0: i * 10, y0: 0, x1: i * 10 + 5, y1: 5, value: i });
  const tree = buildRTree(items);
  const r = rangeQuery(tree, { x0: -100, y0: -100, x1: 200, y1: 100 });
  assert.equal(r.length, 10);
});

test('R-tree 无相交', () => {
  const items: RRect[] = [
    { x0: 0, y0: 0, x1: 1, y1: 1, value: 1 },
    { x0: 100, y0: 100, x1: 101, y1: 101, value: 2 },
  ];
  const tree = buildRTree(items);
  const r = rangeQuery(tree, { x0: 50, y0: 50, x1: 60, y1: 60 });
  assert.equal(r.length, 0);
});

test('R-tree 触发多层（>FANOUT=4）', () => {
  const items: RRect[] = [];
  for (let i = 0; i < 20; i++) items.push({ x0: i, y0: i, x1: i + 1, y1: i + 1, value: i });
  const tree = buildRTree(items);
  const r = rangeQuery(tree, { x0: -100, y0: -100, x1: 200, y1: 200 });
  assert.equal(r.length, 20);
});

test('R-tree 与朴素对照（随机）', () => {
  const items: RRect[] = [];
  for (let i = 0; i < 50; i++) {
    const x = Math.floor(Math.random() * 100);
    const y = Math.floor(Math.random() * 100);
    items.push({ x0: x, y0: y, x1: x + 5, y1: y + 5, value: i });
  }
  const tree = buildRTree(items);
  const queries: Rect[] = [
    { x0: 0, y0: 0, x1: 50, y1: 50 },
    { x0: 20, y0: 20, x1: 80, y1: 80 },
    { x0: 90, y0: 90, x1: 110, y1: 110 },
  ];
  for (const q of queries) {
    const result = rangeQuery(tree, q)
      .map((r) => r.value)
      .sort((a, b) => a - b);
    const expected = naive(items, q)
      .map((r) => r.value)
      .sort((a, b) => a - b);
    assert.deepEqual(result, expected);
  }
});
