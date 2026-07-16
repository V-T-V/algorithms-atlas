import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildExpressionTree,
  evalExprTree,
  exprTreeToInfix,
  infixToPostfix,
} from '../../src/algorithms/parsing/expression-tree/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/expression-tree/trace.ts';

test('buildExpressionTree 后缀构建+求值', () => {
  // 3 4 + → 7
  const root = buildExpressionTree(['3', '4', '+']);
  assert.equal(evalExprTree(root), 7);
});

test('buildExpressionTree 优先级（3 4 2 * +）', () => {
  const root = buildExpressionTree(['3', '4', '2', '*', '+']);
  assert.equal(evalExprTree(root), 11);
  assert.equal(exprTreeToInfix(root), '(3 + (4 * 2))');
});

test('infixToPostfix 基本转换', () => {
  assert.deepEqual(infixToPostfix('3 + 4'), ['3', '4', '+']);
  assert.deepEqual(infixToPostfix('3 + 4 * 2'), ['3', '4', '2', '*', '+']);
});

test('infixToPostfix 括号', () => {
  assert.deepEqual(infixToPostfix('(3 + 4) * 2'), ['3', '4', '+', '2', '*']);
});

test('buildExpressionTree 幂右结合', () => {
  // 2 3 2 ^ ^ → 2^(3^2)=512
  const root = buildExpressionTree(['2', '3', '2', '^', '^']);
  assert.equal(evalExprTree(root), 512);
});

test('buildExpressionTree 中缀→后缀→树→求值 一致', () => {
  for (const expr of ['1 + 2', '3 * 4 - 5', '(1 + 2) * (3 - 4)', '2 ^ 3 ^ 2']) {
    const post = infixToPostfix(expr);
    const root = buildExpressionTree(post);
    // 用 eval 做参考（仅整数算术）
    const expected = Function(`"use strict";return (${expr.replace(/\^/g, '**')})`)();
    assert.equal(evalExprTree(root), expected, `expr=${expr}`);
  }
});

test('buildExpressionTree 非法 token 抛错', () => {
  assert.throws(() => buildExpressionTree(['abc']));
});

test('buildExpressionTree 缺操作数抛错', () => {
  assert.throws(() => buildExpressionTree(['3', '+']));
});

test('buildExpressionTree 钩子触发', () => {
  let reduces = 0;
  buildExpressionTree(['1', '2', '+'], { onReduce: () => reduces++ });
  assert.equal(reduces, 1);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
});
