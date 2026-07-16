import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tarjanScc, type GraphInput } from '../../src/algorithms/graph/tarjan-scc/impl.ts';

// 把分量集合规范化为「排序后的分量的集合」便于比较
const norm = (comps: string[][]): string[] => comps.map((c) => [...c].sort().join(',')).sort();

const G: GraphInput = {
  nodes: ['0', '1', '2', '3', '4', '5'],
  edges: [
    { from: '0', to: '1' },
    { from: '1', to: '2' },
    { from: '2', to: '0' },
    { from: '3', to: '4' },
    { from: '4', to: '5' },
    { from: '5', to: '3' },
    { from: '4', to: '1' }, // 桥接边，不合并 SCC
  ],
};

test('tarjan-scc 正确识别两个三元环', () => {
  const { components } = tarjanScc(G);
  assert.deepEqual(norm(components), ['0,1,2', '3,4,5']);
});

test('tarjan-scc DAG 中每点自成一分量', () => {
  const dag: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
    ],
  };
  const { components } = tarjanScc(dag);
  assert.deepEqual(norm(components), ['A', 'B', 'C']);
});

test('tarjan-scc 单环是一个分量', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'A' },
    ],
  };
  const { components } = tarjanScc(g);
  assert.equal(components.length, 1);
  assert.deepEqual(norm(components), ['A,B,C']);
});

test('tarjan-scc 自环节点自成一分量', () => {
  const g: GraphInput = {
    nodes: ['A', 'B'],
    edges: [{ from: 'A', to: 'A' }],
  };
  const { components } = tarjanScc(g);
  assert.deepEqual(norm(components), ['A', 'B']);
});

test('tarjan-scc 空图与单节点', () => {
  assert.deepEqual(tarjanScc({ nodes: [], edges: [] }).components, []);
  assert.deepEqual(norm(tarjanScc({ nodes: ['X'], edges: [] }).components), ['X']);
});

test('tarjan-scc 钩子被调用', () => {
  const discovered: string[] = [];
  const components: string[][] = [];
  tarjanScc(G, {
    onDiscover: (v) => discovered.push(v),
    onComponent: (comp) => components.push(comp),
  });
  assert.equal(discovered.length, 6);
  assert.equal(components.length, 2);
});

test('tarjan-scc low 更新在回溯边发生', () => {
  let updates = 0;
  tarjanScc(
    {
      nodes: ['A', 'B', 'C'],
      edges: [
        { from: 'A', to: 'B' },
        { from: 'B', to: 'C' },
        { from: 'C', to: 'A' },
      ],
    },
    { onUpdateLow: () => updates++ },
  );
  assert.ok(updates >= 1, '回溯边应触发 low 更新');
});
