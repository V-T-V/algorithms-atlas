import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  incircle,
  delaunayFlip,
  delaunayFlipAll,
  type Point,
  type Quad,
} from '../../src/algorithms/geometry/geo-delaunay-flip/impl.ts';

const P = (x: number, y: number): Point => ({ x, y });

test('incircle D 在外接圆内 > 0', () => {
  // △ABC = (0,0),(4,0),(2,3)，D=(2,1) 在其外接圆内
  assert.ok(incircle(P(0, 0), P(4, 0), P(2, 3), P(2, 1)) > 0);
});

test('incircle D 在外接圆外 < 0', () => {
  assert.ok(incircle(P(0, 0), P(4, 0), P(2, 3), P(2, 10)) < 0);
});

test('delaunayFlip 需翻转时返回 true', () => {
  const quad: Quad = { a: P(0, 0), b: P(2, 3), c: P(4, 0), d: P(2, 1) };
  assert.equal(delaunayFlip(quad), true);
});

test('delaunayFlip 已合法返回 false', () => {
  const quad: Quad = { a: P(0, 0), b: P(2, 3), c: P(4, 0), d: P(2, 10) };
  assert.equal(delaunayFlip(quad), false);
});

test('delaunayFlipAll 计数翻转', () => {
  const q1: Quad = { a: P(0, 0), b: P(2, 3), c: P(4, 0), d: P(2, 1) };
  const q2: Quad = { a: P(0, 0), b: P(2, 10), c: P(4, 0), d: P(2, 1) };
  assert.ok(delaunayFlipAll([q1, q2]) >= 1);
});
