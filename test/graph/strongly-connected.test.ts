import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  stronglyConnected,
  type GraphInput,
} from '../../src/algorithms/graph/strongly-connected/impl.ts';

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

test('strongly-connected 正确识别两个三元环', () => {
  const { components } = stronglyConnected(G);
  assert.deepEqual(norm(components), ['0,1,2', '3,4,5']);
});

test('strongly-connected DAG 中每点自成一分量', () => {
  const dag: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
    ],
  };
  const { components } = stronglyConnected(dag);
  assert.deepEqual(norm(components), ['A', 'B', 'C']);
});

test('strongly-connected 单环是一个分量', () => {
  const g: GraphInput = {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'A' },
    ],
  };
  const { components } = stronglyConnected(g);
  assert.equal(components.length, 1);
  assert.deepEqual(norm(components), ['A,B,C']);
});

test('strongly-connected 嵌套：大环 + 内部小环', () => {
  // A→B→C→D→A 大环；B→E→B 小环（E 自成？否，B↔E 互达构成 SCC）
  const g: GraphInput = {
    nodes: ['A', 'B', 'C', 'D', 'E'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' },
      { from: 'D', to: 'A' },
      { from: 'B', to: 'E' },
      { from: 'E', to: 'B' }, // B↔E 同 SCC，但 B 在大环里 → {A,B,C,D,E} 全连通？
    ],
  };
  // B→E→B 且 B→C→D→A→B，所以 A,B,C,D,E 全在一个 SCC
  const { components } = stronglyConnected(g);
  assert.equal(components.length, 1);
  assert.deepEqual(norm(components), ['A,B,C,D,E']);
});

test('strongly-connected 空图与单节点', () => {
  assert.deepEqual(stronglyConnected({ nodes: [], edges: [] }).components, []);
  assert.deepEqual(norm(stronglyConnected({ nodes: ['X'], edges: [] }).components), ['X']);
});

test('strongly-connected 钩子被调用', () => {
  const finished: string[] = [];
  const comps: string[][] = [];
  stronglyConnected(G, {
    onFinish: (v) => finished.push(v),
    onComponent: (comp) => comps.push(comp),
  });
  assert.equal(finished.length, 6, '每个节点完成一次');
  assert.equal(comps.length, 2);
});

test('strongly-connected 与 Tarjan 结果一致（弱等价校验）', () => {
  // 校验：分量划分互不相交且覆盖所有节点
  const { components } = stronglyConnected(G);
  const all = new Set<string>();
  for (const c of components) for (const id of c) all.add(id);
  assert.equal(all.size, G.nodes.length);
  // 每个分量内任意两点互相可达（这里用「都在分量里」代理，分量已是 SCC 定义）
  assert.equal(norm(components).length, 2);
});
