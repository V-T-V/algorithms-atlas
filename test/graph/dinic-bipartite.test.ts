import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  dinicBipartite,
  type BipartiteInput,
} from '../../src/algorithms/graph/dinic-bipartite/impl.ts';

test('dinic-bipartite 完美匹配 = 4', () => {
  const g: BipartiteInput = {
    left: ['L1', 'L2', 'L3', 'L4'],
    right: ['R1', 'R2', 'R3', 'R4'],
    edges: [
      { from: 'L1', to: 'R1' },
      { from: 'L1', to: 'R2' },
      { from: 'L2', to: 'R1' },
      { from: 'L3', to: 'R3' },
      { from: 'L4', to: 'R3' },
      { from: 'L4', to: 'R4' },
    ],
  };
  const { matchCount, matches } = dinicBipartite(g);
  assert.equal(matchCount, 4);
  assert.equal(matches.length, 4);
  // 每个左部点最多匹配一次
  const leftUsed = new Set<string>();
  const rightUsed = new Set<string>();
  for (const [l, r] of matches) {
    assert.ok(!leftUsed.has(l));
    assert.ok(!rightUsed.has(r));
    leftUsed.add(l);
    rightUsed.add(r);
  }
});

test('dinic-bipartite 简单链', () => {
  const g: BipartiteInput = {
    left: ['A', 'B'],
    right: ['X', 'Y'],
    edges: [
      { from: 'A', to: 'X' },
      { from: 'B', to: 'X' },
    ],
  };
  // 只能匹配 1 个（X 被两方争抢）
  assert.equal(dinicBipartite(g).matchCount, 1);
});

test('dinic-bipartite 无边', () => {
  const g: BipartiteInput = {
    left: ['A', 'B'],
    right: ['X', 'Y'],
    edges: [],
  };
  assert.equal(dinicBipartite(g).matchCount, 0);
});

test('dinic-bipartite 空集', () => {
  const g: BipartiteInput = { left: [], right: [], edges: [] };
  assert.equal(dinicBipartite(g).matchCount, 0);
});

test('dinic-bipartite 钩子被调用', () => {
  const g: BipartiteInput = {
    left: ['A', 'B'],
    right: ['X', 'Y'],
    edges: [
      { from: 'A', to: 'X' },
      { from: 'B', to: 'Y' },
    ],
  };
  const pairs: Array<[string, string]> = [];
  let doneCount = -1;
  dinicBipartite(g, {
    onMatch: (p) => pairs.push(p),
    onDone: (mc) => {
      doneCount = mc;
    },
  });
  assert.equal(pairs.length, 2);
  assert.equal(doneCount, 2);
});
