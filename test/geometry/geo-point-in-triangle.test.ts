import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pointInTriangle } from '../../src/algorithms/geometry/geo-point-in-triangle/impl.ts';
test('在内', () => {
  assert.equal(
    pointInTriangle({ x: 0.2, y: 0.2 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }),
    true,
  );
});
test('在外', () => {
  assert.equal(
    pointInTriangle({ x: 2, y: 2 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }),
    false,
  );
});
