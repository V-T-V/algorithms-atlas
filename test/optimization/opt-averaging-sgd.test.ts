import { test } from 'node:test';
import assert from 'node:assert/strict';
import { averagedSgd } from '../../src/algorithms/optimization/opt-averaging-sgd/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-averaging-sgd/trace.ts';
test('ASGD 返回平均参数', () => {
  const avg = averagedSgd(() => ({ grad: [1] }), 1, 0.01, 10);
  assert.equal(avg.length, 1);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
