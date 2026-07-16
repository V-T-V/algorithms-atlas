import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  randomRestartHill,
  type RrhcProblem,
} from '../../src/algorithms/ai-search/ais-random-restart-hill/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-random-restart-hill/trace.ts';
const P: RrhcProblem = {
  domain: [0, 10],
  eval: (x) => -Math.abs(x - 7) + 10,
  neighbors: (x) => [x - 1, x + 1],
  rand: () => 0,
};
test('rrhc 返回域内', () => {
  const b = randomRestartHill(P, 2);
  assert.ok(b >= 0 && b <= 10);
});
test('rrhc trace 非空', () => assert.ok(buildTrace().length >= 2));
