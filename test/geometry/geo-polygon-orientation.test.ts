import { test } from 'node:test';
import assert from 'node:assert/strict';
import { polygonOrientation } from '../../src/algorithms/geometry/geo-polygon-orientation/impl.ts';
test('逆时针', () => {
  assert.equal(
    polygonOrientation([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
    ]),
    'ccw',
  );
});
test('顺时针', () => {
  assert.equal(
    polygonOrientation([
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 0 },
    ]),
    'cw',
  );
});
