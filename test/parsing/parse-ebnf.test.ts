import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseEBNF,
  serializeNode,
  desugar,
  EbnfParseError,
} from '../../src/algorithms/parsing/parse-ebnf/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/parse-ebnf/trace.ts';

test('parse-ebnf 基本规则', () => {
  const g = parseEBNF("<S> ::= 'a' 'b'");
  assert.equal(g.rules.length, 1);
  assert.equal(g.start, 'S');
  assert.equal(serializeNode(g.rules[0]!.expr), "'a' 'b'");
});

test('parse-ebnf 后缀 * + ?', () => {
  const g = parseEBNF("S ::= 'a'* 'b'+ 'c'?");
  const s = serializeNode(g.rules[0]!.expr);
  assert.ok(s.includes("'a' 'a'") === false); // 检查不直接展开
  assert.ok(s.includes("{ 'a' }"));
  assert.ok(s.includes("( 'b' )+"));
  assert.ok(s.includes("[ 'c' ]"));
});

test('parse-ebnf 分组与选择', () => {
  const g = parseEBNF("S ::= ('+' | '-') Num");
  const s = serializeNode(g.rules[0]!.expr);
  assert.ok(s.includes("'+'"));
  assert.ok(s.includes("'-'"));
  assert.ok(s.includes('Num'));
});

test('parse-ebnf 重复 {}', () => {
  const g = parseEBNF("S ::= { 'a' }");
  const expr = g.rules[0]!.expr;
  assert.equal(expr.kind, 'star');
});

test('parse-ebnf 可选 []', () => {
  const g = parseEBNF("S ::= [ 'a' ]");
  const expr = g.rules[0]!.expr;
  assert.equal(expr.kind, 'opt');
});

test('parse-ebnf ε', () => {
  const g = parseEBNF('S ::= ε');
  assert.equal(g.rules[0]!.expr.kind, 'empty');
});

test('parse-ebnf 多规则', () => {
  const g = parseEBNF("S ::= A | B\nA ::= 'a'\nB ::= 'b'");
  assert.equal(g.rules.length, 3);
  assert.equal(g.start, 'S');
});

test('parse-ebnf 裸单词首字母大写为非终结符', () => {
  const g = parseEBNF('S ::= Term num');
  const items = (
    g.rules[0]!.expr as { kind: string; items: { kind: string; name?: string; text?: string }[] }
  ).items;
  assert.equal(items[0]!.kind, 'nonterm');
  assert.equal(items[1]!.kind, 'term');
});

test('parse-ebnf 错误：未闭合括号', () => {
  assert.throws(
    () => parseEBNF("S ::= ('a'"),
    (e: unknown) => e instanceof EbnfParseError,
  );
});

test('parse-ebnf 错误：缺定义符', () => {
  assert.throws(
    () => parseEBNF("S 'a'"),
    (e: unknown) => e instanceof EbnfParseError,
  );
});

test('parse-ebnf desugar 引入辅助非终结符', () => {
  const g = parseEBNF("S ::= 'a'+");
  const prods = desugar(g);
  // 至少包含原始 S 和若干辅助
  assert.ok(prods.length >= 2);
  assert.ok(prods.some((p) => p.lhs === 'S'));
});

test('parse-ebnf desugar star 含 ε 候选', () => {
  const g = parseEBNF("S ::= 'a'*");
  const prods = desugar(g);
  // 找到递归产生式（含 ε 候选）
  const recProd = prods.find((p) => p.alternatives.some((a) => a.length === 0));
  assert.ok(recProd, '应存在 ε 候选');
});

test('parse-ebnf desugar opt 有两候选', () => {
  const g = parseEBNF("S ::= ['a']");
  const prods = desugar(g);
  // opt 对应的非终结符有 [inner] 和 ε 两个候选
  const optProd = prods.find(
    (p) => p.alternatives.length === 2 && p.alternatives.some((a) => a.length === 0),
  );
  assert.ok(optProd);
});

test('buildTrace 生成 aux 帧', () => {
  const frames = buildTrace("S ::= ('a' | 'b')+");
  assert.ok(frames.length >= 3);
  for (const f of frames) assert.ok(f.aux);
  const last = frames[frames.length - 1]!;
  const start = last.aux!.find((e) => e.label === '起始符');
  assert.ok(start);
  assert.equal(start!.value, 'S');
});
