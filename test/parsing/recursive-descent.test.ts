import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  recursiveDescent,
  parseExpr,
  evalAst,
  tokenize,
  type TreeNode,
} from '../../src/algorithms/parsing/recursive-descent/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/parsing/recursive-descent/trace.ts';

/** 收集 AST 的「结构签名」：后序遍历输出 value 序列。 */
function signature(n: TreeNode): string {
  if (!n.children || n.children.length === 0) return String(n.value);
  return `(${signature(n.children[0]!)} ${n.value} ${signature(n.children[1]!)})`;
}

test('recursive-descent 简单加减', () => {
  // 3 + 4 → (+ 3 4)
  const ast = parseExpr('3 + 4');
  assert.equal(signature(ast), '(3 + 4)');
  assert.equal(evalAst(ast), 7);
});

test('recursive-descent 优先级：* 高于 +', () => {
  // 3 + 4 * 2 → (+ 3 (* 4 2))
  const ast = parseExpr('3 + 4 * 2');
  assert.equal(signature(ast), '(3 + (4 * 2))');
  assert.equal(evalAst(ast), 11);
  // 根是 + ，左叶 3，右子树是 *
  assert.equal(ast.value, '+');
  assert.equal(ast.children![0]!.value, '3');
  assert.equal(ast.children![1]!.value, '*');
});

test('recursive-descent 左结合', () => {
  // 1 - 2 - 3 → (- (- 1 2) 3) = -4
  const ast = parseExpr('1 - 2 - 3');
  assert.equal(signature(ast), '((1 - 2) - 3)');
  assert.equal(evalAst(ast), -4);
  // 8 / 4 / 2 → (/ (/ 8 4) 2) = 1
  const ast2 = parseExpr('8 / 4 / 2');
  assert.equal(signature(ast2), '((8 / 4) / 2)');
  assert.equal(evalAst(ast2), 1);
});

test('recursive-descent 括号', () => {
  // (3 + 4) * 2 → (* (+ 3 4) 2) = 14
  const ast = parseExpr('(3 + 4) * 2');
  assert.equal(signature(ast), '((3 + 4) * 2)');
  assert.equal(evalAst(ast), 14);
  assert.equal(ast.value, '*');
});

test('recursive-descent 嵌套括号', () => {
  // ((1 + 2) * 3) - 4 = 5
  const ast = parseExpr('((1 + 2) * 3) - 4');
  assert.equal(evalAst(ast), 5);
});

test('recursive-descent 综合', () => {
  // 3 + 4 * (2 - 1) = 7
  const ast = parseExpr(DEFAULT_INPUT);
  assert.equal(evalAst(ast), 7);
  assert.equal(ast.value, '+');
});

test('recursive-descent 单个数字', () => {
  const ast = parseExpr('42');
  assert.equal(ast.value, '42');
  assert.equal(evalAst(ast), 42);
  assert.equal(ast.children, undefined);
});

test('recursive-descent 多位数与小数', () => {
  const ast = parseExpr('100 + 2.5');
  assert.equal(evalAst(ast), 102.5);
  assert.equal(ast.children![0]!.value, '100');
  assert.equal(ast.children![1]!.value, '2.5');
});

test('recursive-descent 空表达式', () => {
  const ast = recursiveDescent([]);
  // 空输入：factor 消费 undefined 会抛错或返回占位
  // 这里行为是 consume() 拿到 undefined → parseFloat('undefined') = NaN
  assert.ok(Number.isNaN(evalAst(ast)) || ast.value !== undefined);
});

test('tokenize 工具', () => {
  assert.deepEqual(tokenize('3 + 4 * 2'), ['3', '+', '4', '*', '2']);
  assert.deepEqual(tokenize('(1+2)*3'), ['(', '1', '+', '2', ')', '*', '3']);
});

test('recursive-descent 运算符节点 role=pivot，数字=final/default', () => {
  const ast = parseExpr('3 + 4');
  assert.equal(ast.role, 'pivot'); // +
  assert.equal(ast.children![0]!.role, 'default'); // 3
  assert.equal(ast.children![1]!.role, 'default'); // 4
});

test('recursive-descent 钩子被调用', () => {
  let enters = 0;
  let matches = 0;
  let nodes = 0;
  let results = 0;
  parseExpr('3 + 4 * 2', {
    onEnter: () => enters++,
    onMatch: () => matches++,
    onNode: () => nodes++,
    onResult: () => results++,
  });
  // 5 个 token 全部消费
  assert.equal(matches, 5);
  // 节点：3,4,2 三个数字 + (* 4 2) + (+ 3 ...) = 5
  assert.equal(nodes, 5);
  assert.equal(results, 1);
  assert.ok(enters >= 3); // 至少进入 expr/term/factor
});

test('recursive-descent onMatch 位置正确', () => {
  const matched: Array<[string, number]> = [];
  parseExpr('3 + 4', {
    onMatch: (t, p) => matched.push([t, p]),
  });
  assert.deepEqual(matched, [
    ['3', 0],
    ['+', 1],
    ['4', 2],
  ]);
});

test('buildTrace 生成 tree 帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 4);
  // 终帧应有 tree
  const last = frames[frames.length - 1]!;
  assert.ok(last.tree, '终帧应有 tree');
  assert.equal(last.tree!.value, '+');
});

test('buildTrace 终帧 AST 可求值', () => {
  const frames = buildTrace('2 * (3 + 4)');
  const last = frames[frames.length - 1]!;
  assert.ok(last.tree);
  assert.equal(evalAst(last.tree!), 14);
});
