import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  forwardChecking,
  type FcProblem,
} from '../../src/algorithms/ai-search/ais-forward-checking/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-forward-checking/trace.ts';
const P: FcProblem = {
  n: 3,
  domain: [0, 1, 2],
  edges: [
    [0, 1],
    [1, 2],
  ],
  conflict: (i, vi, j, vj) => vi === vj,
};
test('fc 求解图着色', () => assert.notEqual(forwardChecking(P), null));
test('fc trace 非空', () => assert.ok(buildTrace().length >= 2));
