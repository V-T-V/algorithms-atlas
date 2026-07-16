import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rectIntersect } from '../../src/algorithms/geometry/geo-rectangle-intersect/impl.ts';

const R = (x: number, y: number, w: number, h: number) => ({ x, y, w, h });

test('rectIntersect 部分重叠', () => {
  const r = rectIntersect(R(0, 0, 4, 4), R(2, 2, 4, 4));
  assert.equal(r.area, 4);
  assert.deepEqual(r.rect, { x: 2, y: 2, w: 2, h: 2 });
});

test('rectIntersect 不相交', () => {
  const r = rectIntersect(R(0, 0, 2, 2), R(5, 5, 2, 2));
  assert.equal(r.area, 0);
  assert.equal(r.rect, null);
});

test('rectIntersect 一个包含另一个', () => {
  const r = rectIntersect(R(0, 0, 10, 10), R(2, 2, 2, 2));
  assert.equal(r.area, 4);
});

test('rectIntersect 仅边相接（面积 0）', () => {
  const r = rectIntersect(R(0, 0, 2, 2), R(2, 0, 2, 2));
  assert.equal(r.area, 0);
});

test('rectIntersect 完全相同', () => {
  const r = rectIntersect(R(0, 0, 3, 3), R(0, 0, 3, 3));
  assert.equal(r.area, 9);
});
