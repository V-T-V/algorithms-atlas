import { test } from 'node:test';
import assert from 'node:assert/strict';
import { segmentLength } from '../../src/algorithms/geometry/geo-segment-length/impl.ts';
test('3-4-5', () => {
  assert.equal(segmentLength({ x: 0, y: 0 }, { x: 3, y: 4 }), 5);
});
