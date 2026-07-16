import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  lcaTarjan,
  type GraphInput,
  type LcaQuery,
} from '../../src/algorithms/graph/lca-tarjan/impl.ts';

const G: GraphInput = {
  nodes: ['1', '2', '3', '4', '5'],
  edges: [
    { from: '1', to: '2' },
    { from: '2', to: '3' },
    { from: '1', to: '4' },
    { from: '4', to: '5' },
  ],
  root: '1',
};

test('lca-tarjan 正确 LCA', () => {
  const queries: LcaQuery[] = [
    { u: '3', v: '5' },
    { u: '3', v: '2' },
    { u: '4', v: '5' },
    { u: '3', v: '4' },
  ];
  const { answers } = lcaTarjan(G, queries);
  assert.equal(answers[0], '1'); // LCA(3,5)=1
  assert.equal(answers[1], '2'); // LCA(3,2)=2
  assert.equal(answers[2], '4'); // LCA(4,5)=4
  assert.equal(answers[3], '1'); // LCA(3,4)=1
});

test('lca-tarjan 自身询问', () => {
  const { answers } = lcaTarjan(G, [{ u: '3', v: '3' }]);
  assert.equal(answers[0], '3');
});

test('lca-tarjan 与根的询问', () => {
  const { answers } = lcaTarjan(G, [{ u: '5', v: '1' }]);
  assert.equal(answers[0], '1');
});

test('lca-tarjan 兄弟节点', () => {
  // 2 与 4 是兄弟，LCA=1
  const { answers } = lcaTarjan(G, [{ u: '2', v: '4' }]);
  assert.equal(answers[0], '1');
});

test('lca-tarjan 钩子被调用', () => {
  const visited: string[] = [];
  const answered: string[] = [];
  lcaTarjan(G, [{ u: '3', v: '5' }], {
    onVisit: (u) => visited.push(u),
    onAnswer: (u, v, l) => answered.push(`${[u, v].sort().join('∩')}=${l}`),
  });
  assert.equal(visited.length, 5);
  assert.deepEqual(answered, ['3∩5=1']);
});
