import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dsatur } from '../../src/algorithms/graph/graph-dsatur/impl.ts';

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

test('dsatur 合法着色', () => {
  const color = dsatur(G);
  for (const e of G.edges) {
    assert.notEqual(color.get(e.from), color.get(e.to));
  }
});

test('dsatur 三角形 3 色', () => {
  const color = dsatur({
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'A', to: 'C' },
    ],
  });
  assert.equal(Math.max(...color.values()), 2);
});

test('dsatur 空图', () => {
  const color = dsatur({ nodes: ['A', 'B'], edges: [] });
  assert.equal(color.get('A'), 0);
  assert.equal(color.get('B'), 0);
});

test('dsatur 五边形环 3 色', () => {
  const color = dsatur({
    nodes: ['1', '2', '3', '4', '5'],
    edges: [
      { from: '1', to: '2' },
      { from: '2', to: '3' },
      { from: '3', to: '4' },
      { from: '4', to: '5' },
      { from: '5', to: '1' },
    ],
  });
  // 奇环至少 3 色
  assert.ok(Math.max(...color.values()) >= 2);
});
