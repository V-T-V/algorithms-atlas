import { test } from 'node:test';
import assert from 'node:assert/strict';
import { minEnclosingCircle } from '../../src/algorithms/geometry/min-enclosing-circle/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/geometry/min-enclosing-circle/trace.ts';

test('minEnclosingCircle 覆盖所有点', () => {
  const pts = [
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 0, y: 4 },
    { x: 1, y: 1 },
  ];
  const { circle } = minEnclosingCircle(pts);
  for (const p of pts) {
    const d = Math.hypot(p.x - circle.c.x, p.y - circle.c.y);
    assert.ok(d <= circle.r + 1e-6, `点 (${p.x},${p.y}) 不在圆内`);
  }
});

test('minEnclosingCircle 两点 → 直径圆', () => {
  const { circle } = minEnclosingCircle([
    { x: 0, y: 0 },
    { x: 4, y: 0 },
  ]);
  assert.equal(circle.r, 2);
  assert.equal(circle.c.x, 2);
});

test('minEnclosingCircle 等边三角形外接圆', () => {
  const { circle } = minEnclosingCircle([
    { x: 0, y: 0 },
    { x: 2, y: 0 },
    { x: 1, y: 1.732 },
  ]);
  assert.ok(Math.abs(circle.r - 1.154) < 0.01);
});

test('minEnclosingCircle 钩子触发', () => {
  let triggered = false;
  minEnclosingCircle(
    [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 0, y: 4 },
    ],
    { onResult: () => (triggered = true) },
  );
  assert.ok(triggered);
});

test('buildTrace 含圆心', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
});
