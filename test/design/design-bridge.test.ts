import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  VectorRenderer,
  RasterRenderer,
  CircleShape,
  RectangleShape,
} from '../../src/algorithms/design/design-bridge/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/design/design-bridge/trace.ts';

test('bridge 圆 × 矢量', () => {
  const s = new CircleShape(new VectorRenderer(), 1, 2, 3);
  assert.ok(s.draw().includes('vector'));
  assert.ok(s.draw().includes('r=3'));
});
test('bridge 圆 × 光栅', () => {
  const s = new CircleShape(new RasterRenderer(), 0, 0, 1);
  assert.ok(s.draw().startsWith('raster'));
});
test('bridge 矩形 × 矢量', () => {
  const s = new RectangleShape(new VectorRenderer(), 0, 0, 4, 5);
  assert.ok(s.draw().includes('vector rect'));
});
test('bridge 矩形 × 光栅', () => {
  const s = new RectangleShape(new RasterRenderer(), 1, 1, 2, 3);
  assert.ok(s.draw().includes('raster rect'));
});
test('bridge 同形状可换渲染器', () => {
  const v = new CircleShape(new VectorRenderer(), 0, 0, 1).draw();
  const r = new CircleShape(new RasterRenderer(), 0, 0, 1).draw();
  assert.notEqual(v, r);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace(DEFAULT_INPUT).length >= 3);
});
