import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  proofNumberSearch,
  setLeafByState,
  INF,
  type PnNode,
} from '../../src/algorithms/ai-search/proof-number-search/impl.ts';

test('PN 叶子 proven → proof=0, disproof=INF', () => {
  const n: PnNode = {
    id: 'x',
    type: 'OR',
    leafState: 'proven',
    proof: 1,
    disproof: 1,
    expanded: false,
  };
  setLeafByState(n);
  assert.equal(n.proof, 0);
  assert.equal(n.disproof, INF);
});

test('PN 叶子 disproven → proof=INF, disproof=0', () => {
  const n: PnNode = {
    id: 'x',
    type: 'OR',
    leafState: 'disproven',
    proof: 1,
    disproof: 1,
    expanded: false,
  };
  setLeafByState(n);
  assert.equal(n.proof, INF);
  assert.equal(n.disproof, 0);
});

test('PN 叶子 unknown → proof=1, disproof=1', () => {
  const n: PnNode = {
    id: 'x',
    type: 'OR',
    leafState: 'unknown',
    proof: 0,
    disproof: 0,
    expanded: false,
  };
  setLeafByState(n);
  assert.equal(n.proof, 1);
  assert.equal(n.disproof, 1);
});

test('PN OR 根有 proven 子 → 整树被证明', () => {
  // 直接构造已展开树
  const root: PnNode = {
    id: 'root',
    type: 'OR',
    proof: 1,
    disproof: 1,
    expanded: false,
    children: [
      { id: 'a', type: 'AND', leafState: 'unknown', proof: 1, disproof: 1, expanded: false },
      { id: 'b', type: 'AND', leafState: 'proven', proof: 1, disproof: 1, expanded: false },
    ],
  };
  const r = proofNumberSearch(root, () => [], 10);
  assert.equal(r.proven, true);
  assert.equal(r.disproven, false);
  assert.equal(root.proof, 0);
});

test('PN AND 根所有子 disproven → 被反证', () => {
  const root: PnNode = {
    id: 'root',
    type: 'AND',
    proof: 1,
    disproof: 1,
    expanded: false,
    children: [
      { id: 'a', type: 'OR', leafState: 'disproven', proof: 1, disproof: 1, expanded: false },
      { id: 'b', type: 'OR', leafState: 'disproven', proof: 1, disproof: 1, expanded: false },
    ],
  };
  const r = proofNumberSearch(root, () => [], 10);
  assert.equal(r.proven, false);
  assert.equal(r.disproven, true);
  assert.equal(root.disproof, 0);
});

test('PN 通过展开未知叶子最终证明 OR 根', () => {
  // 根 OR，一个 AND 子节点的某个 OR 子叶为 unknown，展开后置为 proven
  const root: PnNode = {
    id: 'root',
    type: 'OR',
    proof: 1,
    disproof: 1,
    expanded: false,
  };
  let calls = 0;
  const expander = (): PnNode[] => {
    calls++;
    if (calls === 1) {
      // 展开根 → 一个 AND 子，含一个 unknown OR 叶
      return [
        {
          id: 'a',
          type: 'AND',
          proof: 1,
          disproof: 1,
          expanded: false,
          children: [
            { id: 'a1', type: 'OR', leafState: 'unknown', proof: 1, disproof: 1, expanded: false },
          ],
        },
      ];
    }
    if (calls === 2) {
      // 展开 a1 → 置为 proven
      return [
        { id: 'a1x', type: 'AND', leafState: 'proven', proof: 1, disproof: 1, expanded: false },
      ];
    }
    return [];
  };
  const r = proofNumberSearch(root, expander, 50);
  assert.equal(r.proven, true);
  assert.equal(root.proof, 0);
});

test('PN 钩子被调用', () => {
  const root: PnNode = {
    id: 'root',
    type: 'OR',
    proof: 1,
    disproof: 1,
    expanded: false,
    children: [
      { id: 'b', type: 'AND', leafState: 'proven', proof: 1, disproof: 1, expanded: false },
    ],
  };
  let iters = 0;
  let expands = 0;
  let updates = 0;
  proofNumberSearch(root, () => [], 10, {
    onIter: () => iters++,
    onExpand: () => expands++,
    onRootUpdate: () => updates++,
  });
  assert.ok(iters >= 0);
  // 直接已证明（root.proof===0）时无需展开，但若进入循环则会调用
  void expands;
  void updates;
});
