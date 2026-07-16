import { test } from 'node:test';
import assert from 'node:assert/strict';
import { homothety } from '../../src/algorithms/geometry/geo-homothety/impl.ts';
test('放大2倍', () => {
  assert.deepEqual(homothety({ x: 2, y: 0 }, { x: 0, y: 0 }, 2), { x: 4, y: 0 });
});
