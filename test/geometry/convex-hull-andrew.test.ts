import { test } from 'node:test';
import assert from 'node:assert/strict';
import { convexHullAndrew } from '../../src/algorithms/geometry/convex-hull-andrew/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/geometry/convex-hull-andrew/trace.ts';

test('convexHullAndrew 正方形点集', () => {
  const { hull } = convexHullAndrew([
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 4, y: 4 },
    { x: 0, y: 4 },
    { x: 2, y: 2 },
  ]);
  assert.equal(hull.length, 4);
});

test('convexHullAndrew 内部点不在凸包上', () => {
  const { hull } = convexHullAndrew([
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 0, y: 10 },
    { x: 1, y: 1 },
  ]);
  assert.equal(hull.length, 3);
});

test('convexHullAndrew 共线退化为端点', () => {
  // 严格凸（<=0）会剔除共线中间点
  const { hull } = convexHullAndrew([
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
  ]);
  assert.equal(hull.length, 2);
});

test('convexHullAndrew 钩子触发', () => {
  let pushed = 0;
  convexHullAndrew(
    [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 0, y: 4 },
    ],
    { onPush: () => pushed++ },
  );
  assert.ok(pushed >= 3);
});

test('buildTrace 含凸包', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
});
