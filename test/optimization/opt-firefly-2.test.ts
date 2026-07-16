import { test } from 'node:test';
import assert from 'node:assert/strict';
import { firefly } from '../../src/algorithms/optimization/opt-firefly-2/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-firefly-2/trace.ts';
test('萤火虫收敛', () => {
  const r = firefly((x) => x[0]! * x[0]! + x[1]! * x[1]!, 2, 15, 40);
  assert.ok(r.bestFit < 10);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
