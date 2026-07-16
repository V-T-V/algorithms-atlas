import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lion } from '../../src/algorithms/optimization/opt-lion/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-lion/trace.ts';
test('Lion 收敛', () => {
  const r = lion((x) => [...x], [5, 5], 0.1, 0.9, 0.99, 200);
  assert.ok(r.fx < 1);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
