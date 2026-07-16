import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  polygonCentroid,
  polygonArea,
} from '../../src/algorithms/geometry/polygon-centroid/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/geometry/polygon-centroid/trace.ts';

test('polygonCentroid 矩形重心在中心', () => {
  const { centroid } = polygonCentroid([
    { x: 0, y: 0 },
    { x: 8, y: 0 },
    { x: 8, y: 6 },
    { x: 0, y: 6 },
  ]);
  assert.deepEqual([centroid.x, centroid.y], [4, 3]);
});

test('polygonArea 已知值', () => {
  assert.equal(
    polygonArea([
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 0, y: 3 },
    ]),
    6,
  );
});

test('polygonCentroid 少于3顶点抛错', () => {
  assert.throws(() =>
    polygonCentroid([
      { x: 0, y: 0 },
      { x: 1, y: 1 },
    ]),
  );
});

test('polygonCentroid 三角形重心=顶点均值', () => {
  let cx = -1;
  polygonCentroid(
    [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 0, y: 2 },
    ],
    {
      onResult: (x) => (cx = x),
    },
  );
  assert.ok(Math.abs(cx - 2 / 3) < 1e-9);
});

test('buildTrace 含重心', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
  const last = frames[frames.length - 1]!;
  assert.ok(last.map);
});
