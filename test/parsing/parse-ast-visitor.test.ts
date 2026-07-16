import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  dfsVisit,
  bfsVisit,
  countLeaves,
  findAllByType,
  collectLeafValues,
  type AstNode,
  type VisitHooks,
} from '../../src/algorithms/parsing/parse-ast-visitor/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/parsing/parse-ast-visitor/trace.ts';

const T: AstNode = DEFAULT_INPUT;

test('parse-ast-visitor DFS 访问所有节点', () => {
  const s = dfsVisit(T);
  // Program, Assign, Ident, BinOp, Num, Num, Assign, Ident, Num = 9
  assert.equal(s.visited, 9);
});

test('parse-ast-visitor BFS 同样访问所有节点', () => {
  const s = bfsVisit(T);
  assert.equal(s.visited, 9);
});

test('parse-ast-visitor maxDepth 正确', () => {
  const s = dfsVisit(T);
  // Assign(1) → BinOp(2) → Num(3)
  assert.equal(s.maxDepth, 3);
});

test('parse-ast-visitor countByType', () => {
  const s = dfsVisit(T);
  assert.equal(s.countByType['Assign'], 2);
  assert.equal(s.countByType['Num'], 3);
  assert.equal(s.countByType['Ident'], 2);
});

test('parse-ast-visitor enter 返回 false 剪枝', () => {
  let count = 0;
  dfsVisit(T, {
    enter: (n) => {
      count++;
      if (n.type === 'BinOp') return false; // 不进入子树
    },
  });
  // Program, Assign, Ident, BinOp（剪枝）, Assign, Ident, Num = 7
  assert.equal(count, 7);
});

test('parse-ast-visitor leave 后序', () => {
  const order: string[] = [];
  dfsVisit(T, { leave: (n) => order.push(n.type) });
  // 后序：叶子先。Num/Num 在 BinOp 之前
  const numIdx = order.indexOf('Num');
  const binopIdx = order.indexOf('BinOp');
  assert.ok(numIdx < binopIdx);
});

test('parse-ast-visitor visit by type', () => {
  let nums = 0;
  dfsVisit(T, { visit: { Num: () => nums++ } });
  assert.equal(nums, 3);
});

test('parse-ast-visitor countLeaves', () => {
  assert.equal(countLeaves(T), 5); // Ident, Num, Num, Ident, Num
});

test('parse-ast-visitor findAllByType', () => {
  const assigns = findAllByType(T, 'Assign');
  assert.equal(assigns.length, 2);
});

test('parse-ast-visitor collectLeafValues', () => {
  const vals = collectLeafValues(T);
  assert.deepEqual(vals, ['x', '1', '2', 'y', '3']);
});

test('parse-ast-visitor 钩子', () => {
  let enters = 0;
  let types = 0;
  const hooks: VisitHooks = {
    onEnter: () => enters++,
    onVisitType: () => types++,
  };
  dfsVisit(T, {}, hooks);
  assert.equal(enters, 9);
  assert.equal(types, 9);
});

test('buildTrace 生成 tree 帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
  for (const f of frames) assert.ok(f.tree);
  const last = frames[frames.length - 1]!;
  const total = last.aux!.find((e) => e.label === '总节点数');
  assert.ok(total);
  assert.equal(total!.value, '9');
});
