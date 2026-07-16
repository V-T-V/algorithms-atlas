import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseRegex,
  serializeRegex,
  countLeaves,
  RegexParseError,
  type RegexHooks,
} from '../../src/algorithms/parsing/parse-regex-ast/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/parse-regex-ast/trace.ts';

test('parse-regex-ast 单字符', () => {
  const ast = parseRegex('a');
  assert.equal(ast.kind, 'char');
});

test('parse-regex-ast 连接', () => {
  const ast = parseRegex('abc');
  assert.equal(ast.kind, 'concat');
});

test('parse-regex-ast 选择', () => {
  const ast = parseRegex('a|b|c');
  assert.equal(ast.kind, 'alt');
  assert.equal((ast as { children: unknown[] }).children.length, 3);
});

test('parse-regex-ast Kleene 星', () => {
  const ast = parseRegex('a*');
  assert.equal(ast.kind, 'star');
});

test('parse-regex-ast 加号', () => {
  const ast = parseRegex('a+');
  assert.equal(ast.kind, 'plus');
});

test('parse-regex-ast 问号', () => {
  const ast = parseRegex('a?');
  assert.equal(ast.kind, 'opt');
});

test('parse-regex-ast 括号分组', () => {
  const ast = parseRegex('(ab)|c');
  assert.equal(ast.kind, 'alt');
});

test('parse-regex-ast 任意字符', () => {
  const ast = parseRegex('a.c');
  assert.equal(ast.kind, 'concat');
});

test('parse-regex-ast 字符类', () => {
  const ast = parseRegex('[a-z]');
  assert.equal(ast.kind, 'class');
  const cls = ast as { ranges: Array<{ from: string; to: string }>; negate: boolean };
  assert.equal(cls.ranges[0]!.from, 'a');
  assert.equal(cls.ranges[0]!.to, 'z');
  assert.equal(cls.negate, false);
});

test('parse-regex-ast 取反字符类', () => {
  const ast = parseRegex('[^0-9]');
  const cls = ast as { ranges: Array<{ from: string; to: string }>; negate: boolean };
  assert.equal(cls.negate, true);
});

test('parse-regex-ast 转义', () => {
  const ast = parseRegex('a\\.b');
  const s = serializeRegex(ast);
  assert.ok(s.includes('.'));
});

test('parse-regex-ast 后缀组合 a*+', () => {
  const ast = parseRegex('a*+');
  assert.equal(ast.kind, 'plus');
});

test('parse-regex-ast 错误：未闭合括号', () => {
  assert.throws(
    () => parseRegex('(ab'),
    (e: unknown) => e instanceof RegexParseError,
  );
});

test('parse-regex-ast 错误：起始就是 *', () => {
  assert.throws(
    () => parseRegex('*ab'),
    (e: unknown) => e instanceof RegexParseError,
  );
});

test('parse-regex-ast serialize 往返', () => {
  const ast = parseRegex('a(b|c)*');
  const s = serializeRegex(ast);
  const ast2 = parseRegex(s);
  assert.equal(serializeRegex(ast2), s);
});

test('parse-regex-ast countLeaves', () => {
  assert.equal(countLeaves(parseRegex('abc')), 3);
  assert.equal(countLeaves(parseRegex('a|b')), 2);
  assert.equal(countLeaves(parseRegex('')), 0);
});

test('parse-regex-ast 钩子', () => {
  let count = 0;
  let results = 0;
  const hooks: RegexHooks = {
    onNode: () => count++,
    onResult: () => results++,
  };
  parseRegex('a|b', hooks);
  assert.ok(count >= 3); // a, b, alt
  assert.equal(results, 1);
});

test('buildTrace 生成 tree 终态帧', () => {
  const frames = buildTrace('(a|b)*c');
  assert.ok(frames.length >= 3);
  const last = frames[frames.length - 1]!;
  assert.ok(last.tree, '终态应有 tree');
  assert.ok(last.aux);
});
