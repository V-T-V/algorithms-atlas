import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dStarLite, type DStarGraph } from '../../src/algorithms/ai-search/ais-dstar-lite/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-dstar-lite/trace.ts';
const G: DStarGraph = {
  start: 0,
  goal: 2,
  pred: (n) =>
    n === 2
      ? [
          { from: 1, cost: 1 },
          { from: 0, cost: 5 },
        ]
      : n === 1
        ? [{ from: 0, cost: 1 }]
        : [],
  succ: (n) =>
    n === 0
      ? [
          { to: 1, cost: 1 },
          { to: 2, cost: 5 },
        ]
      : n === 1
        ? [{ to: 2, cost: 1 }]
        : [],
  h: (n) => [2, 1, 0][n] ?? 0,
};
test('dstar-lite 返回路径', () => {
  const p = dStarLite(G);
  assert.equal(p[0], 0);
  assert.equal(p.at(-1), 2);
});
test('dstar-lite trace 非空', () => assert.ok(buildTrace().length >= 2));
