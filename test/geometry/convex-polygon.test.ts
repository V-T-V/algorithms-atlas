import { test } from 'node:test';
import assert from 'node:assert/strict';
import { convexPolygon } from '../../src/algorithms/geometry/convex-polygon/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/geometry/convex-polygon/trace.ts';

test('convexPolygon 正方形为凸', () => {
  const { convex } = convexPolygon([
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 4, y: 4 },
    { x: 0, y: 4 },
  ]);
  assert.equal(convex, true);
});

test('convexPolygon 凹四边形非凸', () => {
  const { convex } = convexPolygon([
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 4 },
  ]);
  assert.equal(convex, false);
});

test('convexPolygon 共线非严格凸', () => {
  const { convex } = convexPolygon([
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 1, y: 1 },
  ]);
  assert.equal(convex, false);
});

test('convexPolygon 少于3点非凸', () => {
  const { convex } = convexPolygon([
    { x: 0, y: 0 },
    { x: 1, y: 0 },
  ]);
  assert.equal(convex, false);
});

test('buildTrace 含结果', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
  const last = frames[frames.length - 1]!;
  assert.ok(last.map);
});
