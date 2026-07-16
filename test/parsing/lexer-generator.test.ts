import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  generateLexer,
  DEMO_RULES,
  DEMO_INPUT,
  type TokenRule,
} from '../../src/algorithms/parsing/lexer-generator/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/lexer-generator/trace.ts';

test('lexer-generator 扫描演示输入', () => {
  const lex = generateLexer(DEMO_RULES);
  const toks = lex.scan(DEMO_INPUT);
  assert.deepEqual(
    toks.map((t) => t.kind),
    ['ID', 'ASSIGN', 'NUM', 'PLUS', 'ID'],
  );
  assert.equal(toks[2]!.text, '42');
});

test('lexer-generator 最长匹配：123abc → NUM 123 + ID abc', () => {
  const lex = generateLexer(DEMO_RULES);
  const toks = lex.scan('123abc');
  assert.equal(toks[0]!.kind, 'NUM');
  assert.equal(toks[0]!.text, '123');
  assert.equal(toks[1]!.kind, 'ID');
  assert.equal(toks[1]!.text, 'abc');
});

test('lexer-generator 规则优先级：关键字先于 ID', () => {
  const rules: TokenRule[] = [
    { kind: 'IF', pattern: 'if' },
    { kind: 'ID', pattern: '[a-zA-Z_]+' },
    { kind: 'WS', pattern: '[ ]+' },
  ];
  const lex = generateLexer(rules);
  const toks = lex.scan('if ifxy');
  assert.equal(toks[0]!.kind, 'IF');
  assert.equal(toks[1]!.kind, 'ID');
});

test('lexer-generator 空白被跳过', () => {
  const lex = generateLexer(DEMO_RULES);
  const toks = lex.scan('  x  ');
  assert.equal(toks.length, 1);
  assert.equal(toks[0]!.kind, 'ID');
});

test('lexer-generator 转义运算符 \\+', () => {
  const rules: TokenRule[] = [
    { kind: 'NUM', pattern: '[0-9]+' },
    { kind: 'PLUS', pattern: '\\+' },
    { kind: 'WS', pattern: '[ ]+' },
  ];
  const lex = generateLexer(rules);
  const toks = lex.scan('1 + 2');
  assert.deepEqual(
    toks.map((t) => t.kind),
    ['NUM', 'PLUS', 'NUM'],
  );
});

test('lexer-generator 星号 * 重复', () => {
  const rules: TokenRule[] = [
    { kind: 'A', pattern: 'a*b' },
    { kind: 'WS', pattern: '[ ]+' },
  ];
  const lex = generateLexer(rules);
  const toks = lex.scan('b aab aaab');
  assert.equal(toks.length, 3);
  assert.equal(toks[1]!.text, 'aab');
});

test('lexer-generator 加号 + 重复', () => {
  const rules: TokenRule[] = [
    { kind: 'A', pattern: 'a+' },
    { kind: 'WS', pattern: '[ ]+' },
  ];
  const lex = generateLexer(rules);
  assert.equal(lex.scan('aaa').length, 1);
  // a+ 至少一个 a，空串不匹配
  const toks = lex.scan('aaa bbb');
  assert.equal(toks[0]!.text, 'aaa');
});

test('lexer-generator 可选 ?', () => {
  const rules: TokenRule[] = [
    { kind: 'SIGN', pattern: '-?[0-9]+' },
    { kind: 'WS', pattern: '[ ]+' },
  ];
  const lex = generateLexer(rules);
  const toks = lex.scan('42 -7');
  assert.equal(toks[0]!.text, '42');
  assert.equal(toks[1]!.text, '-7');
});

test('lexer-generator 字符类范围 [a-z]', () => {
  const rules: TokenRule[] = [
    { kind: 'LOWER', pattern: '[a-z]+' },
    { kind: 'UPPER', pattern: '[A-Z]+' },
    { kind: 'WS', pattern: '[ ]+' },
  ];
  const lex = generateLexer(rules);
  const toks = lex.scan('abc XYZ');
  assert.equal(toks[0]!.kind, 'LOWER');
  assert.equal(toks[1]!.kind, 'UPPER');
});

test('lexer-generator DFA 确有状态', () => {
  const lex = generateLexer(DEMO_RULES);
  assert.ok(lex.dfa.numStates >= 3);
  assert.ok(lex.dfa.accept.size >= 4);
});

test('lexer-generator onError 钩子触发', () => {
  const lex = generateLexer(DEMO_RULES);
  let errors = 0;
  lex.scan('x @ y', { onError: () => errors++ });
  assert.ok(errors >= 1);
});

test('lexer-generator token 区间正确', () => {
  const lex = generateLexer(DEMO_RULES);
  const toks = lex.scan('ab cd');
  assert.equal(toks[0]!.start, 0);
  assert.equal(toks[0]!.end, 2);
  assert.equal(toks[1]!.start, 3);
  assert.equal(toks[1]!.end, 5);
});

test('buildTrace 生成多帧含 graph', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 2);
  assert.ok(frames[0]!.graph, '首帧应含 graph（DFA）');
  const last = frames[frames.length - 1]!;
  assert.ok(last.aux, '末帧含 aux');
});

test('nfaToDfa 子集构造确定性', () => {
  // 同样输入应产生同样状态数
  const lex1 = generateLexer(DEMO_RULES);
  const lex2 = generateLexer(DEMO_RULES);
  assert.equal(lex1.dfa.numStates, lex2.dfa.numStates);
});
