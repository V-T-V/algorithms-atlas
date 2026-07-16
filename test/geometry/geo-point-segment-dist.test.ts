import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pointSegmentDistance } from '../../src/algorithms/geometry/geo-point-segment-dist/impl.ts';
test('投影在线段内', () => {
  assert.ok(
    Math.abs(pointSegmentDistance({ x: 2, y: 3 }, { x: 0, y: 0 }, { x: 4, y: 0 }) - 3) < 1e-9,
  );
});
test('投影在线段外', () => {
  assert.ok(
    Math.abs(pointSegmentDistance({ x: 6, y: 0 }, { x: 0, y: 0 }, { x: 4, y: 0 }) - 2) < 1e-9,
  );
});
