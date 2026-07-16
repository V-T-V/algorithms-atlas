import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyKruskal3 } from '../../src/algorithms/greedy/greedy-kruskal-3/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-kruskal-3/trace.ts';

test('Kruskal 4 顶点 MST 总权重', () => {
  const E = [
    { u: 0, v: 1, w: 1 },
    { u: 1, v: 2, w: 2 },
    { u: 2, v: 3, w: 3 },
    { u: 0, v: 3, w: 4 },
  ];
  const r = greedyKruskal3(4, E);
  assert.equal(r.totalWeight, 1 + 2 + 3);
  assert.equal(r.mstEdges.length, 3);
});

test('Kruskal 拒绝成环边', () => {
  const E = [
    { u: 0, v: 1, w: 1 },
    { u: 1, v: 2, w: 2 },
    { u: 0, v: 2, w: 10 },
  ];
  const r = greedyKruskal3(3, E);
  assert.equal(r.mstEdges.length, 2);
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
