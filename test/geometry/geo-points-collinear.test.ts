import { test } from 'node:test';
import assert from 'node:assert/strict';
import { areCollinear } from '../../src/algorithms/geometry/geo-points-collinear/impl.ts';
test('共线', () => {
  assert.equal(areCollinear({ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }), true);
});
test('不共线', () => {
  assert.equal(areCollinear({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }), false);
});
