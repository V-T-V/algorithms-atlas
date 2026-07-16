import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildLevelGraph,
  sinkReachable,
  type ResidualGraph,
  type ResEdge,
} from '../../src/algorithms/network/net-level-graph/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-level-graph/trace.ts';

function makeGraph(): ResidualGraph {
  return new Map<number, ResEdge[]>([
    [
      0,
      [
        { to: 1, cap: 4, isForward: true },
        { to: 2, cap: 3, isForward: true },
      ],
    ],
    [
      1,
      [
        { to: 3, cap: 2, isForward: true },
        { to: 2, cap: 1, isForward: true },
      ],
    ],
    [2, [{ to: 3, cap: 5, isForward: true }]],
    [3, [{ to: 4, cap: 3, isForward: true }]],
    [4, []],
  ]);
}

test('net-level-graph 源点 level 0', () => {
  const { levels } = buildLevelGraph(makeGraph(), 5, 0, 4);
  assert.equal(levels[0], 0);
});

test('net-level-graph 汇可达且 level 为最短路径', () => {
  const { levels } = buildLevelGraph(makeGraph(), 5, 0, 4);
  assert.ok(sinkReachable(levels, 4));
  // 0->1->3->4 距离 3
  assert.equal(levels[4], 3);
});

test('net-level-graph 分层图只含严格上升边', () => {
  const { levels, levelGraph } = buildLevelGraph(makeGraph(), 5, 0, 4);
  for (let u = 0; u < 5; u++) {
    for (const a of levelGraph.get(u) ?? []) {
      assert.equal(levels[a.to], levels[u]! + 1);
    }
  }
});

test('net-level-graph 不可达节点 level -1', () => {
  const graph: ResidualGraph = new Map([
    [0, [{ to: 1, cap: 0, isForward: true }]],
    [1, []],
  ]);
  const { levels } = buildLevelGraph(graph, 2, 0, 1);
  assert.equal(levels[1], -1);
  assert.equal(sinkReachable(levels, 1), false);
});

test('net-level-graph trace', () => {
  assert.ok(buildTrace().length >= 2);
});
