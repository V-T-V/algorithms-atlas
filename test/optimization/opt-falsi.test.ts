import { test } from 'node:test';
import assert from 'node:assert/strict';
import { regulaFalsi } from '../../src/algorithms/optimization/opt-falsi/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-falsi/trace.ts';
test('试位法求 √2', () => {
  const r = regulaFalsi((x) => x * x - 2, 0, 2);
  assert.ok(Math.abs(r - Math.SQRT2) < 1e-6);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
