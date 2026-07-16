import { test } from 'node:test';
import assert from 'node:assert/strict';
import { convexHullJarvis } from '../../src/algorithms/geometry/convex-hull-jarvis/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/geometry/convex-hull-jarvis/trace.ts';

test('convexHullJarvis 正方形点集', () => {
  const { hull } = convexHullJarvis([
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 4, y: 4 },
    { x: 0, y: 4 },
    { x: 2, y: 2 },
  ]);
  assert.equal(hull.length, 4);
});

test('convexHullJarvis 内部点被排除', () => {
  const { hull } = convexHullJarvis([
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 0, y: 10 },
    { x: 1, y: 1 },
  ]);
  assert.equal(hull.length, 3);
});

test('convexHullJarvis 钩子触发', () => {
  let wrapped = 0;
  convexHullJarvis(
    [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 0, y: 4 },
    ],
    { onWrap: () => wrapped++ },
  );
  assert.ok(wrapped >= 3);
});

test('buildTrace 含凸包', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
});
