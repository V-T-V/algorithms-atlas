import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cactus, type GraphInput } from '../../src/algorithms/graph/cactus/impl.ts';

// 演示仙人掌：0-1(1), 三角环{1,2,3}(边权1), 3-4(2)
// 直径 = 0↔4 = 0-1-3-4 = 1+1+2 = 4
const G: GraphInput = {
  nodes: ['0', '1', '2', '3', '4'],
  edges: [
    { from: '0', to: '1', weight: 1 },
    { from: '1', to: '2', weight: 1 },
    { from: '2', to: '3', weight: 1 },
    { from: '3', to: '1', weight: 1 },
    { from: '3', to: '4', weight: 2 },
  ],
};

test('cactus 正确直径', () => {
  const { diameter } = cactus(G);
  assert.equal(diameter, 4);
});

test('cactus 退化为树（无环）= 树直径', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'A', to: 'B', weight: 1 },
      { from: 'B', to: 'C', weight: 2 },
      { from: 'B', to: 'D', weight: 3 },
    ],
  };
  // 最长 C-B-D = 2+3 = 5
  assert.equal(cactus(g).diameter, 5);
});

test('cactus 单环：直径 = 环周长一半（下取整对应的较远点）', () => {
  // 四元环 A-B-C-D-A，各边权1，周长4。两点最远距离 = 2
  const g: GraphInput = {
    nodes: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'A', to: 'B', weight: 1 },
      { from: 'B', to: 'C', weight: 1 },
      { from: 'C', to: 'D', weight: 1 },
      { from: 'D', to: 'A', weight: 1 },
    ],
  };
  assert.equal(cactus(g).diameter, 2);
});

test('cactus 单节点', () => {
  assert.equal(cactus({ nodes: ['X'], edges: [] }).diameter, 0);
});

test('cactus 钩子被调用', () => {
  const discovered: string[] = [];
  const cycles: number[] = [];
  cactus(G, {
    onDiscover: (v) => discovered.push(v),
    onCycle: (_root, len) => cycles.push(len),
  });
  assert.equal(discovered.length, 5);
  assert.deepEqual(cycles, [3]); // 三角环周长 3
});
