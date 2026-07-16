import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chordalGraph, type GraphInput } from '../../src/algorithms/graph/chordal-graph/impl.ts';

test('chordal-graph 三角形是弦图', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'A' },
    ],
  };
  assert.equal(chordalGraph(g).chordal, true);
});

test('chordal-graph 四边形（无弦）非弦图', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' },
      { from: 'D', to: 'A' },
    ],
  };
  assert.equal(chordalGraph(g).chordal, false);
});

test('chordal-graph 四边形加对角线为弦图', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' },
      { from: 'D', to: 'A' },
      { from: 'A', to: 'C' },
    ],
  };
  assert.equal(chordalGraph(g).chordal, true);
});

test('chordal-graph PEO 长度等于顶点数', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
    ],
  };
  const { peo } = chordalGraph(g);
  assert.equal(peo.length, 3);
});

test('chordal-graph 空图', () => {
  const { chordal, peo } = chordalGraph({ nodes: [], edges: [] });
  assert.equal(chordal, true);
  assert.equal(peo.length, 0);
});

test('chordal-graph 钩子', () => {
  let picks = 0;
  let checks = 0;
  chordalGraph(
    {
      nodes: ['A', 'B', 'C'],
      edges: [
        { from: 'A', to: 'B' },
        { from: 'B', to: 'C' },
        { from: 'C', to: 'A' },
      ],
    },
    { onPick: () => picks++, onCheck: () => checks++ },
  );
  assert.equal(picks, 3);
  assert.equal(checks, 3);
});
