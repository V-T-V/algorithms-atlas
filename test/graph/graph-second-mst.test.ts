import { test } from 'node:test';
import assert from 'node:assert/strict';
import { secondMst } from '../../src/algorithms/graph/graph-second-mst/impl.ts';

test('second-mst 例', () => {
  // A-B(1),B-C(2),C-D(3),A-D(4),A-C(10)
  // MST: A-B(1),B-C(2),C-D(3) = 6
  // 非树边 A-D(4)：路径 A-B-C-D max=3，cand=6+4-3=7
  // 非树边 A-C(10)：路径 A-B-C max=2，cand=6+10-2=14
  // 次小 = 7
  const r = secondMst({
    nodes: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'A', to: 'B', weight: 1 },
      { from: 'B', to: 'C', weight: 2 },
      { from: 'C', to: 'D', weight: 3 },
      { from: 'A', to: 'D', weight: 4 },
      { from: 'A', to: 'C', weight: 10 },
    ],
  });
  assert.equal(r.mstWeight, 6);
  assert.equal(r.secondBest, 7);
});

test('second-mst 三角形', () => {
  // A-B(1),B-C(2),A-C(3). MST=1+2=3. 非树边 A-C(3): 路径 max=2, cand=3+3-2=4
  const r = secondMst({
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B', weight: 1 },
      { from: 'B', to: 'C', weight: 2 },
      { from: 'A', to: 'C', weight: 3 },
    ],
  });
  assert.equal(r.mstWeight, 3);
  assert.equal(r.secondBest, 4);
});

test('second-mst 严格次小避开等权', () => {
  // 三角形全等权 1: MST=2; 非树边 A-C(1): 路径 max=1 == w=1, 跳过；故无严格次小
  const r = secondMst({
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B', weight: 1 },
      { from: 'B', to: 'C', weight: 1 },
      { from: 'A', to: 'C', weight: 1 },
    ],
  });
  assert.equal(r.mstWeight, 2);
  assert.equal(r.secondBest, Infinity);
});
