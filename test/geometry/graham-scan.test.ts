import { test } from 'node:test';
import assert from 'node:assert/strict';
import { grahamScan } from '../../src/algorithms/geometry/graham-scan/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/geometry/graham-scan/trace.ts';

test('grahamScan 正方形点集', () => {
  const { hull } = grahamScan([
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 4, y: 4 },
    { x: 0, y: 4 },
    { x: 2, y: 2 },
  ]);
  assert.equal(hull.length, 4);
});

test('grahamScan 内部点排除', () => {
  const { hull } = grahamScan([
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 0, y: 10 },
    { x: 1, y: 1 },
  ]);
  assert.equal(hull.length, 3);
});

test('grahamScan 钩子触发', () => {
  let anchored = false;
  grahamScan(
    [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 0, y: 4 },
    ],
    { onAnchor: () => (anchored = true) },
  );
  assert.ok(anchored);
});

test('buildTrace 含凸包', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
});
