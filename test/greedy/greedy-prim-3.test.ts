import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyPrim3 } from '../../src/algorithms/greedy/greedy-prim-3/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-prim-3/trace.ts';

test('Prim 4 顶点 MST 权重', () => {
  const G = [
    [Infinity, 1, 5, 4],
    [1, Infinity, 2, Infinity],
    [5, 2, Infinity, 3],
    [4, Infinity, 3, Infinity],
  ];
  const r = greedyPrim3(G, 0);
  // MST: 0-1(1), 1-2(2), 2-3(3) = 6
  assert.equal(r.totalWeight, 6);
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
