import { test } from 'node:test';
import assert from 'node:assert/strict';
import { infixEval, evalExpr, tokenize } from '../../src/algorithms/parsing/infix-eval/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/parsing/infix-eval/trace.ts';

test('infix-eval 简单加减', () => {
  assert.equal(evalExpr('3 + 4'), 7);
  assert.equal(evalExpr('10 - 3 - 2'), 5); // 左结合
  assert.equal(evalExpr('1 + 2 + 3'), 6);
});

test('infix-eval 优先级', () => {
  // 3 + 4 * 2 = 11
  assert.equal(evalExpr('3 + 4 * 2'), 11);
  // 2 * 3 + 4 = 10
  assert.equal(evalExpr('2 * 3 + 4'), 10);
  // 10 - 2 * 3 = 4
  assert.equal(evalExpr('10 - 2 * 3'), 4);
});

test('infix-eval 括号', () => {
  // (3 + 4) * 2 = 14
  assert.equal(evalExpr('(3 + 4) * 2'), 14);
  // ((1 + 2) * 3) = 9
  assert.equal(evalExpr('((1 + 2) * 3)'), 9);
  // 2 * (3 + 4) - 5 = 9
  assert.equal(evalExpr('2 * (3 + 4) - 5'), 9);
});

test('infix-eval 除法', () => {
  assert.equal(evalExpr('8 / 2'), 4);
  assert.equal(evalExpr('7 / 2'), 3.5);
  // 8 / 4 / 2 = 1 (左结合)
  assert.equal(evalExpr('8 / 4 / 2'), 1);
});

test('infix-eval 多位数与小数', () => {
  assert.equal(evalExpr('100 + 200'), 300);
  assert.equal(evalExpr('3.5 * 2'), 7);
  assert.equal(evalExpr('1.5 + 2.5'), 4);
});

test('infix-eval 综合表达式', () => {
  // 3 + 4 * 2 - (1 + 5) * 2 = 3 + 8 - 12 = -1
  assert.equal(evalExpr(DEFAULT_INPUT), -1);
  // 1 + 2 * 3 - 4 / 2 = 1 + 6 - 2 = 5
  assert.equal(evalExpr('1 + 2 * 3 - 4 / 2'), 5);
});

test('infix-eval 空表达式返回 0', () => {
  assert.equal(infixEval([]), 0);
});

test('infix-eval 单个操作数', () => {
  assert.equal(evalExpr('42'), 42);
});

test('tokenize 工具', () => {
  assert.deepEqual(tokenize('3 + 4 * 2'), ['3', '+', '4', '*', '2']);
  assert.deepEqual(tokenize('(1+2)*3'), ['(', '1', '+', '2', ')', '*', '3']);
  assert.deepEqual(tokenize('3.5 * 2'), ['3.5', '*', '2']);
});

test('infix-eval 非法 token 抛错', () => {
  // 直接传入 tokenize 不会产生的非法 token
  assert.throws(() => infixEval(['3', '&', '4']));
  assert.throws(() => infixEval(['x']));
});

test('infix-eval 钩子被调用', () => {
  let reads = 0;
  let operands = 0;
  let computes = 0;
  let results = 0;
  evalExpr('3 + 4 * 2', {
    onRead: () => reads++,
    onPushOperand: () => operands++,
    onCompute: () => computes++,
    onResult: () => results++,
  });
  assert.equal(reads, 5); // 3 + 4 * 2
  assert.equal(operands, 3);
  assert.equal(computes, 2); // 4*2, 3+8
  assert.equal(results, 1);
});

test('infix-eval onCompute 内容正确', () => {
  const calcs: Array<[string, number, number, number]> = [];
  evalExpr('3 + 4 * 2', {
    onCompute: (op, a, b, r) => calcs.push([op, a, b, r]),
  });
  // 先算 4 * 2 = 8，再算 3 + 8 = 11
  assert.deepEqual(calcs[0], ['*', 4, 2, 8]);
  assert.deepEqual(calcs[1], ['+', 3, 8, 11]);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 5);
  const last = frames[frames.length - 1]!;
  const result = last.aux!.find((e) => e.label === '结果 / result');
  assert.ok(result);
  assert.equal(result!.value, '-1');
  assert.equal(result!.role, 'final');
});

test('buildTrace 终帧结果正确', () => {
  const frames = buildTrace('2 * (3 + 4)');
  const last = frames[frames.length - 1]!;
  const result = last.aux!.find((e) => e.label === '结果 / result')!;
  assert.equal(result.value, '14');
});
