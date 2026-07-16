import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildAst, evalAst, astToLisp } from '../../src/algorithms/parsing/ast-builder/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/ast-builder/trace.ts';

test('buildAst + evalAst 加法', () => {
  const ast = buildAst('3 + 4');
  assert.equal(evalAst(ast), 7);
});

test('buildAst 运算符优先级', () => {
  const ast = buildAst('3 + 4 * 2');
  assert.equal(evalAst(ast), 11);
  // 树形：(+ 3 (* 4 2))
  assert.equal(astToLisp(ast), '(+ 3 (* 4 2))');
});

test('buildAst 括号改变结合', () => {
  const ast = buildAst('(3 + 4) * 2');
  assert.equal(evalAst(ast), 14);
  assert.equal(astToLisp(ast), '(* (+ 3 4) 2)');
});

test('buildAst 左结合减法', () => {
  const ast = buildAst('10 - 3 - 2');
  assert.equal(evalAst(ast), 5);
  assert.equal(astToLisp(ast), '(- (- 10 3) 2)');
});

test('buildAst 单数字', () => {
  const ast = buildAst('42');
  assert.equal(ast.type, 'num');
  assert.equal(evalAst(ast), 42);
});

test('buildAst 嵌套括号', () => {
  const ast = buildAst('((1 + 2)) * ((3))');
  assert.equal(evalAst(ast), 9);
});

test('buildAst 除法', () => {
  const ast = buildAst('8 / 4 / 2');
  assert.equal(evalAst(ast), 1);
});

test('buildAst 钩子触发', () => {
  let nodes = 0;
  buildAst('1 + 2', { onNode: () => nodes++ });
  assert.ok(nodes >= 3); // 两个 num + 一个 binop
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
  const last = frames[frames.length - 1]!;
  assert.ok(last.tree, '终帧应有 tree');
});
