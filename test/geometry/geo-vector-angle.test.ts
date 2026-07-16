import { test } from 'node:test';
import assert from 'node:assert/strict';
import { vectorAngle } from '../../src/algorithms/geometry/geo-vector-angle/impl.ts';
import { buildTrace } from '../../src/algorithms/geometry/geo-vector-angle/trace.ts';
test('向量夹角 垂直 = π/2', () => {
  assert.ok(Math.abs(vectorAngle({ x: 1, y: 0 }, { x: 0, y: 1 }) - Math.PI / 2) < 1e-9);
});
test('向量夹角 平行 = 0', () => {
  assert.ok(Math.abs(vectorAngle({ x: 2, y: 0 }, { x: 5, y: 0 })) < 1e-9);
});
test('向量夹角 零向量报错', () => {
  assert.throws(() => vectorAngle({ x: 0, y: 0 }, { x: 1, y: 1 }), RangeError);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
