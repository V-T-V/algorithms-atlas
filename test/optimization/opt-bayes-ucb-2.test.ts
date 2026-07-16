import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  optBayesUcb2,
  demoObjective,
} from '../../src/algorithms/optimization/opt-bayes-ucb-2/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-bayes-ucb-2/trace.ts';

test('bayes-ucb 找到接近峰值 x≈7', () => {
  const r = optBayesUcb2(demoObjective, {
    maxIter: 10,
    candidates: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  });
  assert.ok(Math.abs(r.bestX - 7) <= 1, `bestX=${r.bestX}`);
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
