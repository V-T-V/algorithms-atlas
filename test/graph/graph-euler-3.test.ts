import { test } from 'node:test';
import assert from 'node:assert/strict';
import { eulerCircuit, type BipGraphInput } from '../../src/algorithms/graph/graph-euler-3/impl.ts';

test('euler 完全图 K4 有欧拉回路', () => {
  const g: BipGraphInput = {
    nodes: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' },
      { from: 'D', to: 'A' },
      { from: 'A', to: 'C' },
      { from: 'B', to: 'D' },
    ],
  };
  const r = eulerCircuit(g);
  assert.ok(r !== null);
  assert.equal(r!.length, 7); // 节点数 = 边数+1
});

test('euler 含奇度点不存在', () => {
  const g: BipGraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
    ],
  };
  assert.equal(eulerCircuit(g), null);
});
