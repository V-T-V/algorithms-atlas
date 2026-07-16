import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  hamiltonianCycle,
  type GraphInput,
} from '../../src/algorithms/graph/hamiltonian-cycle/impl.ts';

test('hamiltonian-cycle 四边形有解', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' },
      { from: 'D', to: 'A' },
    ],
  };
  const { cycle } = hamiltonianCycle(g);
  assert.ok(cycle);
  assert.equal(cycle!.length, 4);
  // 验证相邻性（含回到起点）
  const adj = new Map<string, Set<string>>();
  for (const n of g.nodes) adj.set(n, new Set());
  for (const e of g.edges) {
    adj.get(e.from)!.add(e.to);
    adj.get(e.to)!.add(e.from);
  }
  for (let i = 0; i < cycle!.length; i++) {
    const a = cycle![i]!;
    const b = cycle![(i + 1) % cycle!.length]!;
    assert.ok(adj.get(a)!.has(b), `${a}→${b} 应相邻`);
  }
});

test('hamiltonian-cycle 无解', () => {
  // 星形：中心连接三个叶子，叶子间无边 -> 无哈密顿回路
  const g: GraphInput = {
    nodes: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'A', to: 'C' },
      { from: 'A', to: 'D' },
    ],
  };
  const { cycle } = hamiltonianCycle(g);
  assert.equal(cycle, null);
});

test('hamiltonian-cycle 三角形', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'A' },
    ],
  };
  const { cycle } = hamiltonianCycle(g);
  assert.ok(cycle);
  assert.equal(cycle!.length, 3);
});

test('hamiltonian-cycle 单点', () => {
  const g: GraphInput = { nodes: ['X'], edges: [] };
  assert.deepEqual(hamiltonianCycle(g).cycle, ['X']);
});

test('hamiltonian-cycle 空图', () => {
  assert.equal(hamiltonianCycle({ nodes: [], edges: [] }).cycle, null);
});

test('hamiltonian-cycle 钩子', () => {
  let ext = 0;
  let res = 0;
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'A' },
    ],
  };
  hamiltonianCycle(g, { onExtend: () => ext++, onResult: () => res++ });
  assert.ok(ext > 0);
  assert.equal(res, 1);
});
