import { test } from 'node:test';
import assert from 'node:assert/strict';
import { smoothstep } from '../../src/algorithms/numerical/num-smoothstep/impl.ts';
test('smoothstep 中点=0.5', () => {
  assert.ok(Math.abs(smoothstep(0, 1, 0.5) - 0.5) < 1e-9);
});
