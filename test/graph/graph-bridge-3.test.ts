import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  findBridges,
  type BridgeGraphInput,
} from '../../src/algorithms/graph/graph-bridge-3/impl.ts';

test('bridge 基本例', () => {
  const g: BridgeGraphInput = {
    nodes: ['1', '2', '3', '4', '5'],
    edges: [
      { from: '1', to: '2' },
      { from: '1', to: '3' },
      { from: '2', to: '3' },
      { from: '3', to: '4' },
      { from: '4', to: '5' },
    ],
  };
  const r = findBridges(g);
  // 3-4 与 4-5 是桥
  assert.equal(r.length, 2);
});

test('bridge 完全三角无桥', () => {
  const g: BridgeGraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'A' },
    ],
  };
  assert.equal(findBridges(g).length, 0);
});
