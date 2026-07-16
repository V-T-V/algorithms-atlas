import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  dfbbSearch,
  type DfbbProblem,
} from '../../src/algorithms/ai-search/ais-dfbb-search/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-dfbb-search/trace.ts';
const P: DfbbProblem = { weights: [1, 2], values: [1, 5], capacity: 2 };
test('dfbb 求最优', () => assert.equal(dfbbSearch(P), 5));
test('dfbb trace 非空', () => assert.ok(buildTrace().length >= 2));
