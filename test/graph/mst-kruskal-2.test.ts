import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mstKruskal2, type GraphInput } from '../../src/algorithms/graph/mst-kruskal-2/impl.ts';

const G: GraphInput = {
  nodes: ['1', '2', '3', '4'],
  edges: [
    { from: '1', to: '2', weight: 2 },
    { from: '1', to: '4', weight: 1 },
    { from: '2', to: '3', weight: 3 },
    { from: '3', to: '4', weight: 5 },
    { from: '1', to: '3', weight: 4 },
  ],
};

test('mst-kruskal-2 MST 权 = 6', () => {
  const { mstWeight, mstEdges } = mstKruskal2(G);
  assert.equal(mstWeight, 6); // 1+2+3
  assert.equal(mstEdges.length, 3);
});

test('mst-kruskal-2 次小 MST 权 = 7', () => {
  const { secondMstWeight, exists } = mstKruskal2(G);
  assert.ok(exists);
  assert.equal(secondMstWeight, 7);
  // 次小 > MST
  assert.ok(secondMstWeight > 6);
});

test('mst-kruskal-2 MST 唯一时无次小', () => {
  // 所有边权相同，MST 不唯一但任两棵权相等；这里构造一棵权固定的 MST，
  // 非树边替换后权不变 → 不存在严格次小。
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B', weight: 1 },
      { from: 'B', to: 'C', weight: 1 },
      { from: 'A', to: 'C', weight: 1 },
    ],
  };
  const { exists, secondMstWeight, mstWeight } = mstKruskal2(g);
  assert.equal(mstWeight, 2);
  // 所有候选 = 2-1+1 = 2，等于 MST，故不存在严格次小
  assert.equal(exists, false);
  assert.equal(secondMstWeight, mstWeight);
});

test('mst-kruskal-2 不连通返回 ∞', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C', 'D'],
    edges: [{ from: 'A', to: 'B', weight: 1 }],
  };
  const { mstWeight } = mstKruskal2(g);
  assert.equal(mstWeight, Infinity);
});

test('mst-kruskal-2 钩子被调用', () => {
  let mstCalled = false;
  let doneCalled = false;
  const swaps: number[] = [];
  mstKruskal2(G, {
    onMst: () => {
      mstCalled = true;
    },
    onTrySwap: (_e, _mx, cand) => swaps.push(cand),
    onDone: () => {
      doneCalled = true;
    },
  });
  assert.ok(mstCalled);
  assert.ok(swaps.length >= 1);
  assert.ok(doneCalled);
});
