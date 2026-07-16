import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  yaccParse,
  tokenize,
  evalExpr,
  RULES,
  ACTION_TABLE,
  GOTO_TABLE,
} from '../../src/algorithms/parsing/yacc-style-parser/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/yacc-style-parser/trace.ts';

test('yacc-style 单数字求值', () => {
  assert.equal(evalExpr('42'), 42);
});

test('yacc-style 加法', () => {
  assert.equal(evalExpr('3 + 4'), 7);
});

test('yacc-style 乘法优先级高于加法', () => {
  assert.equal(evalExpr('3 + 4 * 2'), 11); // 3 + 8
});

test('yacc-style 乘法在加法前', () => {
  assert.equal(evalExpr('2 * 3 + 4'), 10); // 6 + 4
});

test('yacc-style 括号改变优先级', () => {
  assert.equal(evalExpr('(1 + 2) * 3'), 9);
});

test('yacc-style 减法左结合', () => {
  assert.equal(evalExpr('10 - 2 - 3'), 5); // (10-2)-3
});

test('yacc-style 除法左结合', () => {
  assert.equal(evalExpr('8 / 2 / 2'), 2); // (8/2)/2
});

test('yacc-style 混合四则运算', () => {
  assert.equal(evalExpr('1 + 2 * 3 - 4 / 2'), 5); // 1+6-2
});

test('yacc-style 拒绝不完整表达式', () => {
  const r = yaccParse(tokenize('3 +'));
  assert.equal(r.accepted, false);
});

test('yacc-style 拒绝以运算符开头', () => {
  const r = yaccParse(tokenize('* 3'));
  assert.equal(r.accepted, false);
});

test('yacc-style 拒绝连续运算符', () => {
  const r = yaccParse(tokenize('3 + + 4'));
  assert.equal(r.accepted, false);
});

test('yacc-style tokenize 正确', () => {
  const t = tokenize('1 + 2');
  assert.equal(t[0]!.kind, 'NUM');
  assert.equal(t[0]!.value, 1);
  assert.equal(t[1]!.kind, '+');
  assert.equal(t[3]!.kind, '$'); // 结尾哨兵
});

test('yacc-style 触发归约钩子', () => {
  let reduceCount = 0;
  yaccParse(tokenize('1 + 2'), { onReduce: () => reduceCount++ });
  // F→NUM, T→F, E→T, F→NUM, T→F, E→E+T 至少 6 次
  assert.ok(reduceCount >= 5, `归约次数应 ≥5，实际 ${reduceCount}`);
});

test('yacc-style ACTION/GOTO 表维度一致', () => {
  // 16 个状态
  assert.equal(ACTION_TABLE.length, 16);
  assert.equal(GOTO_TABLE.length, 16);
  // 每行终结符 8 个、非终结符 3 个
  for (const row of ACTION_TABLE) assert.equal(row.length, 8);
  for (const row of GOTO_TABLE) assert.equal(row.length, 3);
});

test('yacc-style RULES 定义完整', () => {
  assert.equal(RULES.length, 8);
  assert.equal(RULES[0]!.lhs, 'E');
  assert.equal(RULES[7]!.display, 'F → NUM');
});

test('buildTrace 生成多帧含结果', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 2);
  const last = frames[frames.length - 1]!;
  assert.ok(last.aux, '末帧含 aux');
  const res = last.aux!.find((e) => e.label === '结果');
  assert.ok(res, '末帧应含结果');
});
