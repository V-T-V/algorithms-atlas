import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greyWolf } from '../../src/algorithms/optimization/opt-grey-wolf/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-grey-wolf/trace.ts';
test('灰狼收敛', () => {
  const r = greyWolf((x) => x[0]! * x[0]! + x[1]! * x[1]!, 2, 20, 50);
  assert.ok(r.bestFit < 2);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
