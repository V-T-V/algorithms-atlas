import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  coarseToFineSearch,
  type CfProblem,
} from '../../src/algorithms/ai-search/ais-coarse-to-fine-search/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-coarse-to-fine-search/trace.ts';
const P: CfProblem = {
  domain: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  goal: 7,
  near: (a, b, res) => Math.abs(a - b) <= res,
  levels: 3,
};
test('cf 找到目标', () => assert.equal(coarseToFineSearch(P), 7));
test('cf trace 非空', () => assert.ok(buildTrace().length >= 2));
