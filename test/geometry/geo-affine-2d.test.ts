import { test } from 'node:test';
import assert from 'node:assert/strict';
import { affine } from '../../src/algorithms/geometry/geo-affine-2d/impl.ts';
test('缩放2倍', () => {
  assert.deepEqual(affine({ x: 1, y: 1 }, { a: 2, b: 0, c: 0, d: 2, e: 0, f: 0 }), { x: 2, y: 2 });
});
test('平移', () => {
  assert.deepEqual(affine({ x: 1, y: 1 }, { a: 1, b: 0, c: 0, d: 1, e: 3, f: 4 }), { x: 4, y: 5 });
});
