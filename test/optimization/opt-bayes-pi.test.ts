import { test } from 'node:test';
import assert from 'node:assert/strict';
import { optBayesPi, demoObjective } from '../../src/algorithms/optimization/opt-bayes-pi/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-bayes-pi/trace.ts';
test('bayes-pi 找到接近峰值', () => {
  const r = optBayesPi(demoObjective, { maxIter: 10, candidates: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] });
  assert.ok(Math.abs(r.bestX - 7) <= 2, `bestX=${r.bestX}`);
});
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
