import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  treePolicy,
  makeTPNode,
  ucb1,
  type TPNode,
} from '../../src/algorithms/ai-search/ais-tree-policy/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-tree-policy/trace.ts';

test('ais-tree-policy ucb1 未访问返回无穷', () => {
  assert.equal(ucb1(0, 0, 10), Infinity);
});

test('ais-tree-policy ucb1 平衡利用探索', () => {
  const exploit = ucb1(10, 9, 100); // 高胜率
  const explore = ucb1(10, 1, 100); // 低胜率
  assert.ok(exploit > explore);
});

test('ais-tree-policy 优先扩展未尝试动作', () => {
  const root = makeTPNode(null);
  root.untried = [0, 1];
  const isTerminal = (): boolean => false;
  const apply = (p: TPNode, a: number): TPNode => {
    const c = makeTPNode(p);
    void a;
    return c;
  };
  const legal = (): number[] => [0, 1];
  const result = treePolicy(root, legal, isTerminal, apply);
  // 应返回新扩展的子节点
  assert.ok(result.parent === root);
});

test('ais-tree-policy 全扩展后用 UCB 选择', () => {
  const root = makeTPNode(null);
  root.untried = [];
  root.visits = 100;
  // 两个子：a0 高胜率，a1 低胜率
  const c0 = makeTPNode(root);
  c0.visits = 50;
  c0.wins = 40;
  const c1 = makeTPNode(root);
  c1.visits = 50;
  c1.wins = 10;
  root.children.set(0, c0);
  root.children.set(1, c1);
  const isTerminal = (): boolean => false;
  const apply = (p: TPNode, a: number): TPNode => {
    const c = makeTPNode(p);
    void a;
    return c;
  };
  const legal = (): number[] => [];
  const result = treePolicy(root, legal, isTerminal, apply);
  // 应选 c0（高 UCB）
  assert.equal(result, c0);
});

test('ais-tree-policy trace', () => {
  assert.ok(buildTrace().length > 2);
});
