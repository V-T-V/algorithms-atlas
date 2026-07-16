import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rotatingCalipers } from '../../src/algorithms/geometry/rotating-calipers/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/geometry/rotating-calipers/trace.ts';

test('rotatingCalipers 矩形直径 = 对角线', () => {
  const { diameter } = rotatingCalipers([
    { x: 0, y: 0 },
    { x: 3, y: 0 },
    { x: 3, y: 4 },
    { x: 0, y: 4 },
  ]);
  assert.equal(diameter, 5);
});

test('rotatingCalipers 等边三角形', () => {
  const { diameter } = rotatingCalipers([
    { x: 0, y: 0 },
    { x: 2, y: 0 },
    { x: 1, y: 1.732 },
  ]);
  assert.ok(Math.abs(diameter - 2) < 0.01);
});

test('rotatingCalipers 钩子触发', () => {
  let n = 0;
  rotatingCalipers(
    [
      { x: 0, y: 0 },
      { x: 3, y: 0 },
      { x: 0, y: 4 },
    ],
    { onAntipodal: () => n++ },
  );
  assert.ok(n >= 3);
});

test('buildTrace 含直径', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
});
