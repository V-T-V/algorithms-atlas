import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  compileGrammar,
  pegMatch,
  matchExpr,
  exprToTreeNode,
  DEMO_GRAMMAR_SRC,
} from '../../src/algorithms/parsing/peg-expression/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/peg-expression/trace.ts';

test('peg-expression 编译演示文法得到 3 条规则', () => {
  const g = compileGrammar(DEMO_GRAMMAR_SRC);
  assert.equal(g.rules.length, 3);
  assert.equal(g.start, 'Expr');
});

test('peg-expression 演示文法匹配 1+2*3', () => {
  const g = compileGrammar(DEMO_GRAMMAR_SRC);
  assert.equal(pegMatch('1+2*3', g), true);
});

test('peg-expression 演示文法匹配 (1+2)*3', () => {
  const g = compileGrammar(DEMO_GRAMMAR_SRC);
  assert.equal(pegMatch('(1+2)*3', g), true);
});

test('peg-expression 演示文法匹配单数字', () => {
  const g = compileGrammar(DEMO_GRAMMAR_SRC);
  assert.equal(pegMatch('42', g), true);
});

test('peg-expression 演示文法拒绝不完整输入', () => {
  const g = compileGrammar(DEMO_GRAMMAR_SRC);
  assert.equal(pegMatch('1+', g), false);
  assert.equal(pegMatch('*3', g), false);
});

test('peg-expression 字面量匹配', () => {
  const g = compileGrammar(`S <- 'abc'`);
  assert.equal(pegMatch('abc', g), true);
  assert.equal(pegMatch('abd', g), false);
});

test('peg-expression 有序选择 /', () => {
  const g = compileGrammar(`S <- ('a' / 'b') 'c'`);
  assert.equal(pegMatch('ac', g), true);
  assert.equal(pegMatch('bc', g), true);
  assert.equal(pegMatch('cc', g), false);
});

test('peg-expression 星号 *', () => {
  const g = compileGrammar(`S <- 'a'* 'b'`);
  assert.equal(pegMatch('b', g), true);
  assert.equal(pegMatch('aaab', g), true);
  assert.equal(pegMatch('aaa', g), false);
});

test('peg-expression 加号 +', () => {
  const g = compileGrammar(`S <- 'a'+ 'b'`);
  assert.equal(pegMatch('ab', g), true);
  assert.equal(pegMatch('b', g), false); // 至少一个 a
});

test('peg-expression 可选 ?', () => {
  const g = compileGrammar(`S <- 'x'? 'y'`);
  assert.equal(pegMatch('y', g), true);
  assert.equal(pegMatch('xy', g), true);
});

test('peg-expression 字符类 [0-9]', () => {
  const g = compileGrammar(`N <- [0-9]+`);
  assert.equal(pegMatch('123', g), true);
  assert.equal(pegMatch('12a', g), false);
});

test('peg-expression 字符类转义 \ d', () => {
  const g = compileGrammar(`N <- [\ d]+`);
  assert.equal(pegMatch('123', g), true);
});

test('peg-expression 字符类转义 \\w', () => {
  const g = compileGrammar(`W <- [\\w]+`);
  assert.equal(pegMatch('abc_123', g), true);
});

test('peg-expression 否定字符类 [^...]', () => {
  const g = compileGrammar(`S <- [^0-9]+`);
  assert.equal(pegMatch('abc', g), true);
  assert.equal(pegMatch('123', g), false);
});

test('peg-expression 正前瞻 &', () => {
  const g = compileGrammar(`S <- &'a' 'a'`);
  assert.equal(pegMatch('a', g), true);
  assert.equal(pegMatch('b', g), false);
});

test('peg-expression 负前瞻 !', () => {
  const g = compileGrammar(`S <- !'a' 'b'`);
  assert.equal(pegMatch('b', g), true);
  assert.equal(pegMatch('a', g), false);
});

test('peg-expression 任意字符 .', () => {
  const g = compileGrammar(`S <- . .`);
  assert.equal(pegMatch('ab', g), true);
  assert.equal(pegMatch('a', g), false);
});

test('peg-expression 嵌套规则引用', () => {
  const g = compileGrammar(`S <- A B\nA <- 'x'\nB <- 'y'`);
  assert.equal(pegMatch('xy', g), true);
});

test('peg-expression matchExpr 直接调用', () => {
  const g = compileGrammar(`S <- 'ab'`);
  const r = matchExpr(g.rules[0]!.expr, 'abcd', 0, g);
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.pos, 2);
});

test('peg-expression exprToTreeNode 生成树', () => {
  const counter = { n: 0 };
  const node = exprToTreeNode({ kind: 'star', inner: { kind: 'lit', value: 'a' } }, counter);
  assert.equal(node.children?.length, 1);
  assert.equal(node.value, '*');
});

test('peg-expression onMatch 钩子触发', () => {
  const g = compileGrammar(DEMO_GRAMMAR_SRC);
  let calls = 0;
  pegMatch('1+2', g, { onMatch: () => calls++ });
  assert.ok(calls > 0);
});

test('peg-expression 双引号字面量', () => {
  const g = compileGrammar(`S <- "ab"`);
  assert.equal(pegMatch('ab', g), true);
});

test('peg-expression 错误：未知规则抛异常', () => {
  const g = compileGrammar(`S <- Undefined`);
  assert.throws(() => pegMatch('x', g));
});

test('buildTrace 生成多帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 2);
  assert.ok(frames[0]!.tree, '首帧应含 tree（文法 AST）');
  const last = frames[frames.length - 1]!;
  assert.ok(last.aux, '末帧含 aux');
});
