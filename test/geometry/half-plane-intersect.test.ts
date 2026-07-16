import { test } from 'node:test';
import assert from 'node:assert/strict';
import { halfPlaneIntersect } from '../../src/algorithms/geometry/half-plane-intersect/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/geometry/half-plane-intersect/trace.ts';

test('halfPlaneIntersect 四个半平面成矩形', () => {
  const { polygon } = halfPlaneIntersect([
    { a: { x: 0, y: 0 }, b: { x: 10, y: 0 } }, // y >= 0
    { a: { x: 10, y: 0 }, b: { x: 10, y: 10 } }, // x <= 10
    { a: { x: 10, y: 10 }, b: { x: 0, y: 10 } }, // y <= 10
    { a: { x: 0, y: 10 }, b: { x: 0, y: 0 } }, // x >= 0
  ]);
  assert.ok(polygon.length >= 3);
});

test('halfPlaneIntersect 少于3半平面返回空', () => {
  const { polygon } = halfPlaneIntersect([{ a: { x: 0, y: 0 }, b: { x: 1, y: 0 } }]);
  assert.deepEqual(polygon, []);
});

test('buildTrace 含区域', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
});
