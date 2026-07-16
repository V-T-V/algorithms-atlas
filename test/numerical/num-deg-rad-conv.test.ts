import { test } from 'node:test';
import assert from 'node:assert/strict';
import { degToRad, radToDeg } from '../../src/algorithms/numerical/num-deg-rad-conv/impl.ts';
test('180° = π', () => {
  assert.ok(Math.abs(degToRad(180) - Math.PI) < 1e-9);
});
test('π = 180°', () => {
  assert.ok(Math.abs(radToDeg(Math.PI) - 180) < 1e-9);
});
