import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dominator, type GraphInput } from '../../src/algorithms/graph/dominator/impl.ts';

// diamond + 旁路：s→a, s→c, a→b, b→c, b→t, c→t
const G: GraphInput = {
  nodes: ['s', 'a', 'b', 'c', 't'],
  edges: [
    { from: 's', to: 'a' },
    { from: 's', to: 'c' },
    { from: 'a', to: 'b' },
    { from: 'b', to: 'c' },
    { from: 'b', to: 't' },
    { from: 'c', to: 't' },
  ],
  start: 's',
};

test('dominator 正确 idom', () => {
  const { idom } = dominator(G);
  assert.equal(idom.get('s'), 's');
  assert.equal(idom.get('a'), 's');
  assert.equal(idom.get('b'), 'a');
  assert.equal(idom.get('c'), 's'); // s→c 直达，旁路 b
  assert.equal(idom.get('t'), 's'); // s→c→t 旁路 a/b
});

test('dominator 单链', () => {
  const g: GraphInput = {
    nodes: ['s', 'a', 'b', 'c'],
    edges: [
      { from: 's', to: 'a' },
      { from: 'a', to: 'b' },
      { from: 'b', to: 'c' },
    ],
    start: 's',
  };
  const { idom } = dominator(g);
  assert.equal(idom.get('a'), 's');
  assert.equal(idom.get('b'), 'a');
  assert.equal(idom.get('c'), 'b');
});

test('dominator 不可达节点不含于结果', () => {
  const g: GraphInput = {
    nodes: ['s', 'a', 'x'],
    edges: [{ from: 's', to: 'a' }],
    start: 's',
  };
  const { idom } = dominator(g);
  assert.equal(idom.has('x'), false);
  assert.equal(idom.get('a'), 's');
});

test('dominator 单节点', () => {
  const { idom } = dominator({ nodes: ['s'], edges: [], start: 's' });
  assert.equal(idom.get('s'), 's');
});

test('dominator 支配树孩子表', () => {
  const { children } = dominator(G);
  // s 的孩子：a, c, t（都直接支配于 s）
  assert.deepEqual([...children.get('s')!].sort(), ['a', 'c', 't']);
  assert.deepEqual(children.get('a'), ['b']);
  assert.deepEqual(children.get('b'), []);
});

test('dominator 钩子被调用', () => {
  const visited: string[] = [];
  const sets: string[] = [];
  dominator(G, {
    onVisit: (v) => visited.push(v),
    onSetIdom: (v) => sets.push(v),
  });
  assert.equal(visited.length, 5); // 全部可达均访问
  assert.ok(sets.length >= 4, '应为除起点外每个可达节点设置 idom');
});
