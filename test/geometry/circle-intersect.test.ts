import { test } from 'node:test';
import assert from 'node:assert/strict';
import { circleIntersect } from '../../src/algorithms/geometry/circle-intersect/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/geometry/circle-intersect/trace.ts';

test('circleIntersect 相交两个点', () => {
  const r = circleIntersect({ c: { x: 0, y: 0 }, r: 2 }, { c: { x: 2, y: 0 }, r: 2 });
  assert.equal(r.state, 'intersect');
  assert.equal(r.points.length, 2);
});

test('circleIntersect 外切一个点', () => {
  const r = circleIntersect({ c: { x: 0, y: 0 }, r: 1 }, { c: { x: 2, y: 0 }, r: 1 });
  assert.equal(r.state, 'tangent');
  assert.equal(r.points.length, 1);
});

test('circleIntersect 相离', () => {
  const r = circleIntersect({ c: { x: 0, y: 0 }, r: 1 }, { c: { x: 10, y: 0 }, r: 1 });
  assert.equal(r.state, 'separate');
  assert.equal(r.points.length, 0);
});

test('circleIntersect 包含', () => {
  const r = circleIntersect({ c: { x: 0, y: 0 }, r: 5 }, { c: { x: 1, y: 0 }, r: 1 });
  assert.equal(r.state, 'contain');
});

test('circleIntersect 对称性', () => {
  const a = circleIntersect({ c: { x: 0, y: 0 }, r: 3 }, { c: { x: 4, y: 0 }, r: 3 });
  const b = circleIntersect({ c: { x: 4, y: 0 }, r: 3 }, { c: { x: 0, y: 0 }, r: 3 });
  assert.equal(a.points.length, b.points.length);
});

test('buildTrace 含状态', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
  const last = frames[frames.length - 1]!;
  assert.ok(last.graph);
});
