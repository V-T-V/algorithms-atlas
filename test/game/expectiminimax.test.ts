import { test } from 'node:test';
import assert from 'node:assert/strict';
import { expectiminimax, type ExpectiNode } from '../../src/algorithms/game/expectiminimax/impl.ts';

const leaf = (id: string, value: number): ExpectiNode => ({
  id,
  type: 'MAX',
  value,
  children: [],
});
const maxNode = (id: string, children: ExpectiNode[]): ExpectiNode => ({
  id,
  type: 'MAX',
  children,
});
const minNode = (id: string, children: ExpectiNode[]): ExpectiNode => ({
  id,
  type: 'MIN',
  children,
});
const chanceNode = (id: string, probs: number[], children: ExpectiNode[]): ExpectiNode => ({
  id,
  type: 'CHANCE',
  probabilities: probs,
  children,
});

test('expectiminimax 演示树：根期望效用 = 8，最优子 = c1', () => {
  // root(MAX) → n1(MIN)[3,8] → min=3；c1(CHANCE)[6@0.5,10@0.5] → 期望=8
  // root = max(3, 8) = 8
  const tree = maxNode('root', [
    minNode('n1', [leaf('l1', 3), leaf('l2', 8)]),
    chanceNode('c1', [0.5, 0.5], [leaf('l3', 6), leaf('l4', 10)]),
  ]);
  const r = expectiminimax(tree);
  assert.equal(r.value, 8);
  assert.equal(r.bestChildId, 'c1');
});

test('expectiminimax 纯 MAX/MIN 退化为 minimax', () => {
  // root(MAX) → [MIN[3,5], MIN[2,9]] = max(min(3,5), min(2,9)) = max(3,2) = 3
  const tree = maxNode('root', [
    minNode('n1', [leaf('a', 3), leaf('b', 5)]),
    minNode('n2', [leaf('c', 2), leaf('d', 9)]),
  ]);
  const r = expectiminimax(tree);
  assert.equal(r.value, 3);
  assert.equal(r.bestChildId, 'n1');
});

test('expectiminimax CHANCE 根返回期望且 bestChildId=null', () => {
  // 根为 CHANCE：[4@0.25, 8@0.75] → 期望 = 1 + 6 = 7
  const tree = chanceNode('root', [0.25, 0.75], [leaf('a', 4), leaf('b', 8)]);
  const r = expectiminimax(tree);
  assert.equal(r.value, 7);
  assert.equal(r.bestChildId, null, 'CHANCE 根无最优子');
});

test('expectiminimax 概率加权正确', () => {
  // CHANCE: [10@0.1, 0@0.9] → 期望 = 1
  const tree = chanceNode('c', [0.1, 0.9], [leaf('a', 10), leaf('b', 0)]);
  assert.equal(expectiminimax(tree).value, 1);
});

test('expectiminimax MAX 选期望最高', () => {
  // root(MAX) → [CHANCE[2@0.5,4@0.5]=3, CHANCE[0@0.5,10@0.5]=5]
  // root = max(3, 5) = 5，选第二个 CHANCE
  const tree = maxNode('root', [
    chanceNode('c1', [0.5, 0.5], [leaf('a', 2), leaf('b', 4)]),
    chanceNode('c2', [0.5, 0.5], [leaf('c', 0), leaf('d', 10)]),
  ]);
  const r = expectiminimax(tree);
  assert.equal(r.value, 5);
  assert.equal(r.bestChildId, 'c2');
});

test('expectiminimax MIN 选期望最低', () => {
  // root(MIN) → [CHANCE[2@0.5,4@0.5]=3, CHANCE[0@0.5,10@0.5]=5]
  // root = min(3, 5) = 3，选第一个 CHANCE
  const tree = minNode('root', [
    chanceNode('c1', [0.5, 0.5], [leaf('a', 2), leaf('b', 4)]),
    chanceNode('c2', [0.5, 0.5], [leaf('c', 0), leaf('d', 10)]),
  ]);
  const r = expectiminimax(tree);
  assert.equal(r.value, 3);
  assert.equal(r.bestChildId, 'c1');
});

test('expectiminimax 单叶子直接返回', () => {
  assert.equal(expectiminimax(leaf('x', 7)).value, 7);
});

test('expectiminimax 深层 MAX-MIN-CHANCE-叶 正确', () => {
  // root(MAX) → n(MIN) → c(CHANCE)[叶 6@0.5, 叶 2@0.5] → 期望 4 → min(4)=4 → root=max(4)=4
  const tree = maxNode('root', [
    minNode('n', [chanceNode('c', [0.5, 0.5], [leaf('a', 6), leaf('b', 2)])]),
  ]);
  const r = expectiminimax(tree);
  assert.equal(r.value, 4);
});

test('expectiminimax 钩子被调用', () => {
  let evals = 0;
  let maxs = 0;
  let chances = 0;
  const tree = maxNode('root', [
    minNode('n1', [leaf('a', 3), leaf('b', 5)]),
    chanceNode('c1', [0.5, 0.5], [leaf('c', 6), leaf('d', 10)]),
  ]);
  expectiminimax(tree, {
    onEvaluate: () => evals++,
    onMax: () => maxs++,
    onChance: () => chances++,
  });
  assert.ok(evals > 0, '应触发 onEvaluate');
  assert.ok(maxs > 0, '应触发 onMax');
  assert.ok(chances > 0, '应触发 onChance');
});

test('expectiminimax CHANCE 缺省概率视为均匀', () => {
  // 不给 probabilities：3 个子节点 [3, 6, 9] → 期望 = (3+6+9)/3 = 6
  const tree: ExpectiNode = {
    id: 'root',
    type: 'CHANCE',
    children: [leaf('a', 3), leaf('b', 6), leaf('c', 9)],
  };
  assert.equal(expectiminimax(tree).value, 6);
});
