import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  meansEndAnalysis,
  type MeaProblem,
} from '../../src/algorithms/ai-search/ais-means-end-analysis/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-means-end-analysis/trace.ts';
const P: MeaProblem = {
  start: [0],
  goal: [2],
  ops: [{ name: 'inc', diff: (s, g) => Math.abs(s[0]! - g[0]!), apply: (s) => [s[0]! + 1] }],
};
test('mea 生成计划', () => assert.deepEqual(meansEndAnalysis(P), ['inc', 'inc']));
test('mea trace 非空', () => assert.ok(buildTrace().length >= 2));
