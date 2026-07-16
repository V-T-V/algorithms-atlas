import { test } from 'node:test';
import assert from 'node:assert/strict';
import { halfPlaneSide } from '../../src/algorithms/geometry/geo-halfplane-side/impl.ts';
test('左侧', () => {
  assert.equal(halfPlaneSide({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }), 'left');
});
test('右侧', () => {
  assert.equal(halfPlaneSide({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: -1 }), 'right');
});
test('共线', () => {
  assert.equal(halfPlaneSide({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }), 'on');
});
