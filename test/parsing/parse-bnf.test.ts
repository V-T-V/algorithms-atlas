import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseBNF,
  serializeBNF,
  BnfParseError,
  type BnfHooks,
} from '../../src/algorithms/parsing/parse-bnf/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/parse-bnf/trace.ts';

test('parse-bnf 解析简单规则', () => {
  const g = parseBNF("<S> ::= 'a' <S> | 'b'");
  assert.equal(g.rules.length, 1);
  assert.equal(g.start, 'S');
  assert.equal(g.rules[0]!.alternatives.length, 2);
  assert.ok(g.nonTerminals.has('S'));
  assert.ok(g.terminals.has('a'));
  assert.ok(g.terminals.has('b'));
});

test('parse-bnf 支持 ::= := =', () => {
  const g1 = parseBNF("<S> ::= 'a'");
  const g2 = parseBNF('<S> := <A>');
  const g3 = parseBNF("<S> = 'x'");
  assert.equal(g1.rules[0]!.lhs, 'S');
  assert.equal(g2.rules[0]!.alternatives[0]![0]!.text, 'A');
  assert.ok(g2.rules[0]!.alternatives[0]![0]!.nonTerminal);
  assert.equal(g3.terminals.has('x'), true);
});

test('parse-bnf ε → 空候选', () => {
  const g = parseBNF('<S> ::= ε | <S> <S>');
  assert.equal(g.rules[0]!.alternatives[0]!.length, 0);
  assert.equal(g.rules[0]!.alternatives[1]!.length, 2);
});

test('parse-bnf epsilon 单词', () => {
  const g = parseBNF('<S> ::= epsilon');
  assert.equal(g.rules[0]!.alternatives[0]!.length, 0);
});

test('parse-bnf 引号允许空格', () => {
  const g = parseBNF("<S> ::= 'if x'");
  assert.ok(g.terminals.has('if x'));
});

test('parse-bnf 注释被忽略', () => {
  const g = parseBNF('<S> ::= /* hi */ <A> // tail\n<A> ::= "a" # hash');
  assert.equal(g.rules.length, 2);
  assert.ok(g.nonTerminals.has('A'));
});

test('parse-bnf 左部非非终结符报错', () => {
  assert.throws(
    () => parseBNF("'x' ::= 'y'"),
    (e: unknown) => e instanceof BnfParseError,
  );
});

test('parse-bnf 缺定义符报错', () => {
  assert.throws(
    () => parseBNF('<S> <A>'),
    (e: unknown) => e instanceof BnfParseError,
  );
});

test('parse-bnf 未闭合非终结符报错', () => {
  assert.throws(
    () => parseBNF('<S ::= a'),
    (e: unknown) => e instanceof BnfParseError,
  );
});

test('parse-bnf serialize 往返', () => {
  const g = parseBNF("<S> ::= 'a' <S> | ε");
  const text = serializeBNF(g);
  const g2 = parseBNF(text);
  assert.equal(g2.rules.length, 1);
  assert.equal(g2.rules[0]!.alternatives.length, 2);
  assert.equal(g2.rules[0]!.alternatives[1]!.length, 0); // ε
});

test('parse-bnf 钩子触发', () => {
  let rules = 0;
  let alts = 0;
  let results = 0;
  const hooks: BnfHooks = {
    onRule: () => rules++,
    onAlternative: () => alts++,
    onResult: () => results++,
  };
  parseBNF("<S> ::= 'a' | 'b'", hooks);
  assert.equal(rules, 1);
  assert.equal(alts, 2);
  assert.equal(results, 1);
});

test('buildTrace 生成 aux 帧', () => {
  const frames = buildTrace("<S> ::= 'a' | <S> <S>");
  assert.ok(frames.length >= 3);
  for (const f of frames) assert.ok(f.aux, '每帧应有 aux');
  const last = frames[frames.length - 1]!;
  const start = last.aux!.find((e) => e.label === '起始符');
  assert.ok(start);
  assert.equal(start!.value, '<S>');
});
