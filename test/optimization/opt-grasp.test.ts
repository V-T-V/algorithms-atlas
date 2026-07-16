import { test } from 'node:test';
import assert from 'node:assert/strict';
import { grasp } from '../../src/algorithms/optimization/opt-grasp/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-grasp/trace.ts';
test('GRASP 返回回路', () => {
  const r = grasp(
    [
      [0, 1, 2],
      [1, 0, 3],
      [2, 3, 0],
    ],
    3,
    10,
    0.3,
  );
  assert.equal(r.best[0], 0);
  assert.ok(r.bestCost >= 0);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
