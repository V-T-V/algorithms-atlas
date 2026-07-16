import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hungarian, type BipartiteGraphInput } from '../../src/algorithms/graph/hungarian/impl.ts';

const G: BipartiteGraphInput = {
  left: ['L1', 'L2', 'L3', 'L4'],
  right: ['R1', 'R2', 'R3', 'R4'],
  edges: [
    { from: 'L1', to: 'R1' },
    { from: 'L1', to: 'R2' },
    { from: 'L2', to: 'R1' },
    { from: 'L2', to: 'R3' },
    { from: 'L3', to: 'R2' },
    { from: 'L3', to: 'R4' },
    { from: 'L4', to: 'R3' },
    { from: 'L4', to: 'R4' },
  ],
};

test('hungarian 完美匹配', () => {
  const r = hungarian(G);
  assert.equal(r.matchCount, 4);
  assert.equal(r.pairs.length, 4);
  // 每个右点至多匹配一个左点
  const rights = r.pairs.map((p) => p.right);
  assert.equal(new Set(rights).size, 4);
  // 每个左点至多匹配一个右点
  const lefts = r.pairs.map((p) => p.left);
  assert.equal(new Set(lefts).size, 4);
});

test('hungarian 匹配边确实来自原图', () => {
  const r = hungarian(G);
  const edgeSet = new Set(G.edges.map((e) => `${e.from}>${e.to}`));
  for (const p of r.pairs) {
    assert.ok(edgeSet.has(`${p.left}>${p.right}`), `${p.left}>${p.right} 不是图中的边`);
  }
});

test('hungarian 不饱和匹配', () => {
  // L1 只能匹配 R1，L2 也只能匹配 R1 → 最大匹配 = 1（其中一个胜出）
  const g: BipartiteGraphInput = {
    left: ['L1', 'L2'],
    right: ['R1', 'R2'],
    edges: [
      { from: 'L1', to: 'R1' },
      { from: 'L2', to: 'R1' },
    ],
  };
  const r = hungarian(g);
  assert.equal(r.matchCount, 1);
});

test('hungarian 空图', () => {
  const r = hungarian({ left: [], right: [], edges: [] });
  assert.equal(r.matchCount, 0);
});

test('hungarian 完全二分图匹配', () => {
  // K3,3 完美匹配 = 3
  const g: BipartiteGraphInput = {
    left: ['A', 'B', 'C'],
    right: ['X', 'Y', 'Z'],
    edges: [
      { from: 'A', to: 'X' },
      { from: 'A', to: 'Y' },
      { from: 'A', to: 'Z' },
      { from: 'B', to: 'X' },
      { from: 'B', to: 'Y' },
      { from: 'B', to: 'Z' },
      { from: 'C', to: 'X' },
      { from: 'C', to: 'Y' },
      { from: 'C', to: 'Z' },
    ],
  };
  assert.equal(hungarian(g).matchCount, 3);
});

test('hungarian 钩子被调用', () => {
  let tries = 0;
  let results = 0;
  const matched: string[] = [];
  hungarian(G, {
    onTryMatch: () => tries++,
    onTryResult: (_u, found) => {
      results++;
      if (found) matched.push('x');
    },
    onMatchEdge: (u) => matched.push(u),
  });
  assert.equal(tries, 4, '应为每个左部节点尝试一次');
  assert.equal(results, 4);
  assert.ok(matched.length >= 4, '至少 4 次匹配翻转');
});
