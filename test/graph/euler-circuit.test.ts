import { test } from 'node:test';
import assert from 'node:assert/strict';
import { eulerCircuit, type GraphInput } from '../../src/algorithms/graph/euler-circuit/impl.ts';

test('euler-circuit 矩形+对角线', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' },
      { from: 'D', to: 'A' },
      { from: 'B', to: 'D' },
    ],
  };
  const { circuit } = eulerCircuit(g);
  assert.ok(circuit);
  assert.equal(circuit!.length, 6); // 5 边 + 1
  assert.equal(circuit![0], circuit![5]); // 回到起点
  // 验证每条边恰好被使用一次
  const used = new Set<string>();
  for (let i = 0; i < circuit!.length - 1; i++) {
    const a = circuit![i]!;
    const b = circuit![i + 1]!;
    const k = [a, b].sort().join('-');
    assert.ok(!used.has(k), `边 ${k} 被重复使用`);
    used.add(k);
  }
  assert.equal(used.size, 5);
});

test('euler-circuit 奇度数无解', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
    ],
  };
  const { circuit, reason } = eulerCircuit(g);
  assert.equal(circuit, null);
  assert.ok(reason);
});

test('euler-circuit 三角形', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'A' },
    ],
  };
  const { circuit } = eulerCircuit(g);
  assert.ok(circuit);
  assert.equal(circuit!.length, 4);
  assert.equal(circuit![0], circuit![3]);
});

test('euler-circuit 空图', () => {
  const { circuit } = eulerCircuit({ nodes: [], edges: [] });
  assert.deepEqual(circuit, []);
});

test('euler-circuit 有向平衡', () => {
  const g: GraphInput = {
    nodes: ['A', 'B'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'A' },
    ],
    undirected: false,
  };
  const { circuit } = eulerCircuit(g);
  assert.ok(circuit);
  assert.equal(circuit!.length, 3);
});

test('euler-circuit 钩子', () => {
  let adv = 0;
  let res = 0;
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'A' },
    ],
  };
  eulerCircuit(g, { onAdvance: () => adv++, onResult: () => res++ });
  assert.equal(adv, 3);
  assert.equal(res, 1);
});
