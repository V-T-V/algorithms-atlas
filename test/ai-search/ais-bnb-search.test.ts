import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bnbSearch, type BnbProblem } from '../../src/algorithms/ai-search/ais-bnb-search/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-bnb-search/trace.ts';
const P: BnbProblem = {
  items: [
    { weight: 1, value: 1 },
    { weight: 2, value: 5 },
  ],
  capacity: 2,
};
test('bnb 求最优值', () => assert.equal(bnbSearch(P), 5));
test('bnb trace 非空', () => assert.ok(buildTrace().length >= 2));
