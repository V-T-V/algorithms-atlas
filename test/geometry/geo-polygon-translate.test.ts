import { test } from 'node:test';
import assert from 'node:assert/strict';
import { translatePolygon } from '../../src/algorithms/geometry/geo-polygon-translate/impl.ts';
test('平移', () => {
  assert.deepEqual(
    translatePolygon(
      [
        { x: 0, y: 0 },
        { x: 1, y: 1 },
      ],
      3,
      4,
    ),
    [
      { x: 3, y: 4 },
      { x: 4, y: 5 },
    ],
  );
});
