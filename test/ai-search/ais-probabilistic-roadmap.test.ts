import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  probabilisticRoadmap,
  type PrmProblem,
} from '../../src/algorithms/ai-search/ais-probabilistic-roadmap/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-probabilistic-roadmap/trace.ts';
const P: PrmProblem = {
  dim: [5, 5],
  sample: () => [2, 2],
  free: () => true,
  start: [0, 0],
  goal: [4, 4],
  k: 3,
};
test('prm 返回路径', () => {
  const p = probabilisticRoadmap(P, 2);
  assert.ok(p.includes(0));
});
test('prm trace 非空', () => assert.ok(buildTrace().length >= 2));
