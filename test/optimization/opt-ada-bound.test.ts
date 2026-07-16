import { test } from 'node:test';
import assert from 'node:assert/strict';
import { adabound } from '../../src/algorithms/optimization/opt-ada-bound/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-ada-bound/trace.ts';
test('AdaBound 收敛', () => {
  const r = adabound((x) => [...x], [5, 5], 0.1, 0.9, 0.999, 0.1, 0.01, 200);
  assert.ok(r.fx < 1);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
