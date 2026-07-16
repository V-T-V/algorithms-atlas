import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  articulationPointDfs,
  type GraphInput,
} from '../../src/algorithms/graph/articulation-point-dfs/impl.ts';

test('articulation-point-dfs 链状图中间节点为割点', () => {
  const g: GraphInput = {
    nodes: ['0', '1', '2', '3', '4'],
    edges: [
      { from: '0', to: '1' },
      { from: '1', to: '2' },
      { from: '2', to: '3' },
      { from: '3', to: '4' },
    ],
  };
  const { articulationPoints } = articulationPointDfs(g);
  assert.deepEqual([...articulationPoints].sort(), ['1', '2', '3']);
});

test('articulation-point-dfs 完全图无割点', () => {
  const g: GraphInput = {
    nodes: ['0', '1', '2'],
    edges: [
      { from: '0', to: '1' },
      { from: '1', to: '2' },
      { from: '0', to: '2' },
    ],
  };
  const { articulationPoints } = articulationPointDfs(g);
  assert.equal(articulationPoints.length, 0);
});

test('articulation-point-dfs 星形图中心是割点', () => {
  const g: GraphInput = {
    nodes: ['c', 'a', 'b', 'd'],
    edges: [
      { from: 'c', to: 'a' },
      { from: 'c', to: 'b' },
      { from: 'c', to: 'd' },
    ],
  };
  const { articulationPoints } = articulationPointDfs(g);
  assert.deepEqual(articulationPoints, ['c']);
});

test('articulation-point-dfs 单边无割点', () => {
  const g: GraphInput = {
    nodes: ['A', 'B'],
    edges: [{ from: 'A', to: 'B' }],
  };
  const { articulationPoints } = articulationPointDfs(g);
  assert.equal(articulationPoints.length, 0);
});

test('articulation-point-dfs 钩子被调用', () => {
  const arts: string[] = [];
  articulationPointDfs(
    {
      nodes: ['0', '1', '2', '3', '4'],
      edges: [
        { from: '0', to: '1' },
        { from: '1', to: '2' },
        { from: '2', to: '3' },
        { from: '3', to: '4' },
      ],
    },
    { onArticulation: (v) => arts.push(v) },
  );
  assert.equal(arts.length, 3);
});
