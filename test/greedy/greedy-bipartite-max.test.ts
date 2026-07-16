import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyBipartiteMatch } from '../../src/algorithms/greedy/greedy-bipartite-max/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-bipartite-max/trace.ts';
test('贪心匹配大小合理', () => {
  assert.equal(
    greedyBipartiteMatch([
      [0, 0],
      [0, 1],
      [1, 1],
    ]),
    2,
  );
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
