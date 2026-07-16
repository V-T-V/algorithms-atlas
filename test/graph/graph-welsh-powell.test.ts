import { test } from 'node:test';
import assert from 'node:assert/strict';
import { welshPowell } from '../../src/algorithms/graph/graph-welsh-powell/impl.ts';

const G = {
  nodes: ['A', 'B', 'C', 'D', 'E'],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'A', to: 'C' },
    { from: 'B', to: 'C' },
    { from: 'B', to: 'D' },
    { from: 'C', to: 'D' },
    { from: 'D', to: 'E' },
  ],
};

test('welsh-powell 合法着色', () => {
  const color = welshPowell(G);
  for (const e of G.edges) {
    assert.notEqual(color.get(e.from), color.get(e.to), `adjacent ${e.from}-${e.to} same color`);
  }
});

test('welsh-powell 三角形需 3 色', () => {
  const color = welshPowell({
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'A', to: 'C' },
    ],
  });
  const max = Math.max(...[...color.values()]);
  assert.equal(max, 2); // 颜色 0,1,2
});

test('welsh-powell 无边图全 0', () => {
  const color = welshPowell({ nodes: ['A', 'B', 'C'], edges: [] });
  for (const v of color.values()) assert.equal(v, 0);
});

test('welsh-powell 单节点', () => {
  const color = welshPowell({ nodes: ['A'], edges: [] });
  assert.equal(color.get('A'), 0);
});
