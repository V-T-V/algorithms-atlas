import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dfp } from '../../src/algorithms/optimization/opt-quasi-dfp-2/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-quasi-dfp-2/trace.ts';
test('DFP 收敛', () => {
  const r = dfp((x) => [...x], [5, 5], 200);
  assert.ok(r.fx < 1);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
