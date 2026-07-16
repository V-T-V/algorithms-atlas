import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bistar, type BipartiteInput } from '../../src/algorithms/graph/bistar/impl.ts';

test('bistar 完美匹配图：覆盖 = 4', () => {
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
  const { coverSize, matchCount } = bistar(g);
  assert.equal(matchCount, 4);
  assert.equal(coverSize, 4); // König: 覆盖 = 匹配
});

test('bistar 覆盖确实覆盖所有边', () => {
  const g: BipartiteInput = {
    left: ['A', 'B'],
    right: ['X', 'Y'],
    edges: [
      { from: 'A', to: 'X' },
      { from: 'A', to: 'Y' },
      { from: 'B', to: 'X' },
    ],
  };
  const { coverLeft, coverRight } = bistar(g);
  const cover = new Set<string>([...coverLeft, ...coverRight]);
  // 每条边至少一端在覆盖中
  for (const e of g.edges) {
    assert.ok(cover.has(e.from) || cover.has(e.to), `edge ${e.from}-${e.to} not covered`);
  }
});

test('bistar 简单星形：覆盖 = 1', () => {
  // 一个左部点连所有右部点 → 选这个左部点即可覆盖
  const g: BipartiteInput = {
    left: ['A'],
    right: ['X', 'Y', 'Z'],
    edges: [
      { from: 'A', to: 'X' },
      { from: 'A', to: 'Y' },
      { from: 'A', to: 'Z' },
    ],
  };
  const { coverSize } = bistar(g);
  assert.equal(coverSize, 1);
});

test('bistar 无边：覆盖 = 0', () => {
  const g: BipartiteInput = {
    left: ['A', 'B'],
    right: ['X', 'Y'],
    edges: [],
  };
  assert.equal(bistar(g).coverSize, 0);
});

test('bistar König 等式：覆盖数 = 匹配数', () => {
  const g: BipartiteInput = {
    left: ['L1', 'L2', 'L3'],
    right: ['R1', 'R2', 'R3'],
    edges: [
      { from: 'L1', to: 'R1' },
      { from: 'L2', to: 'R1' },
      { from: 'L2', to: 'R2' },
      { from: 'L3', to: 'R3' },
    ],
  };
  const { coverSize, matchCount } = bistar(g);
  assert.equal(coverSize, matchCount);
});

test('bistar 钩子被调用', () => {
  const matches: Array<[string, string]> = [];
  let coverCalled = false;
  const g: BipartiteInput = {
    left: ['A', 'B'],
    right: ['X', 'Y'],
    edges: [
      { from: 'A', to: 'X' },
      { from: 'B', to: 'Y' },
    ],
  };
  bistar(g, {
    onMatch: (u, v) => matches.push([u, v]),
    onCover: () => {
      coverCalled = true;
    },
  });
  assert.equal(matches.length, 2);
  assert.ok(coverCalled);
});
