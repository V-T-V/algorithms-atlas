import { test } from 'node:test';
import assert from 'node:assert/strict';
import { zeroWindow, type ZNode } from '../../src/algorithms/ai-search/ais-zero-window/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-zero-window/trace.ts';

test('zero-window fail-low 时返回 upper', () => {
  const r = zeroWindow({ id: 'r', utility: 3 }, 10, 1);
  assert.equal(r.bound, 'upper');
  assert.ok(r.value < 10);
});
test('zero-window fail-high 时返回 lower', () => {
  const r = zeroWindow({ id: 'r', utility: 50 }, 5, 1);
  assert.equal(r.bound, 'lower');
  assert.ok(r.value >= 5);
});
test('zero-window trace 非空', () => assert.ok(buildTrace().length > 0));
