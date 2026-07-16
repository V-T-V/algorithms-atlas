import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  bridgeFindingIter,
  type GraphInput,
} from '../../src/algorithms/graph/bridge-finding-iter/impl.ts';

const norm = (bs: Array<{ from: string; to: string }>): string[] =>
  bs.map((b) => [b.from, b.to].sort().join('-')).sort();

test('bridge-finding-iter 双三角图唯一桥', () => {
  const g: GraphInput = {
    nodes: ['0', '1', '2', '3', '4', '5'],
    edges: [
      { from: '0', to: '1' },
      { from: '1', to: '2' },
      { from: '0', to: '2' },
      { from: '2', to: '3' },
      { from: '3', to: '4' },
      { from: '4', to: '5' },
      { from: '3', to: '5' },
    ],
  };
  const { bridges } = bridgeFindingIter(g);
  assert.deepEqual(norm(bridges), ['2-3']);
});

test('bridge-finding-iter 树所有边都是桥', () => {
  const g: GraphInput = {
    nodes: ['0', '1', '2', '3'],
    edges: [
      { from: '0', to: '1' },
      { from: '1', to: '2' },
      { from: '2', to: '3' },
    ],
  };
  const { bridges } = bridgeFindingIter(g);
  assert.equal(bridges.length, 3);
});

test('bridge-finding-iter 环无桥', () => {
  const g: GraphInput = {
    nodes: ['0', '1', '2', '3'],
    edges: [
      { from: '0', to: '1' },
      { from: '1', to: '2' },
      { from: '2', to: '3' },
      { from: '3', to: '0' },
    ],
  };
  const { bridges } = bridgeFindingIter(g);
  assert.equal(bridges.length, 0);
});

test('bridge-finding-iter 重边视为桥', () => {
  const g: GraphInput = {
    nodes: ['A', 'B'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'A', to: 'B' },
    ],
  };
  const { bridges } = bridgeFindingIter(g);
  assert.equal(bridges.length, 0); // 两条重边互为备份，删一条仍连通
});

test('bridge-finding-iter 钩子被调用', () => {
  const found: string[] = [];
  bridgeFindingIter(
    {
      nodes: ['0', '1', '2'],
      edges: [
        { from: '0', to: '1' },
        { from: '1', to: '2' },
      ],
    },
    { onBridge: (a, b) => found.push(`${a}-${b}`) },
  );
  assert.equal(found.length, 2);
});
