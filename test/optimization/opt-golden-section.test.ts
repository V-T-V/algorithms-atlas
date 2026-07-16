import { test } from 'node:test';
import assert from 'node:assert/strict';
import { goldenSection } from '../../src/algorithms/optimization/opt-golden-section/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-golden-section/trace.ts';
test('黄金分割找 (x-2)² 极小', () => {
  const r = goldenSection((x) => (x - 2) * (x - 2), -5, 5, 1e-9);
  assert.ok(Math.abs(r - 2) < 1e-5);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
