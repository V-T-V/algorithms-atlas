import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  transform,
  arithmeticRewrite,
  sameTree,
  nodeCount,
  type AstNode,
  type RewriteHooks,
} from '../../src/algorithms/parsing/parse-ast-transformer/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/parsing/parse-ast-transformer/trace.ts';

const N = (v: number): AstNode => ({ type: 'Num', value: v });
const BIN = (op: string, l: AstNode, r: AstNode): AstNode => ({
  type: 'BinOp',
  value: op,
  children: [l, r],
});

test('parse-ast-transformer 不变换（恒等 rewrite）', () => {
  const t = N(5);
  const r = transform(t, (node) => node);
  assert.ok(sameTree(r.root, t));
  assert.equal(r.rewrites, 0);
});

test('parse-ast-transformer 常量折叠 1+2=3', () => {
  const r = transform(BIN('+', N(1), N(2)), arithmeticRewrite, {}, 5);
  assert.equal(r.root.type, 'Num');
  assert.equal(r.root.value, 3);
});

test('parse-ast-transformer 乘法折叠', () => {
  const r = transform(BIN('*', N(4), N(5)), arithmeticRewrite, {}, 5);
  assert.equal(r.root.value, 20);
});

test('parse-ast-transformer 单位元 x+0 → x', () => {
  const r = transform(BIN('+', N(7), N(0)), arithmeticRewrite, {}, 5);
  assert.equal(r.root.type, 'Num');
  assert.equal(r.root.value, 7);
});

test('parse-ast-transformer 单位元 x*1 → x', () => {
  const r = transform(BIN('*', N(9), N(1)), arithmeticRewrite, {}, 5);
  assert.equal(r.root.value, 9);
});

test('parse-ast-transformer 零元 x*0 → 0', () => {
  const r = transform(BIN('*', N(123), N(0)), arithmeticRewrite, {}, 5);
  assert.equal(r.root.type, 'Num');
  assert.equal(r.root.value, 0);
});

test('parse-ast-transformer 嵌套 (1+2)*1+0 → 3', () => {
  const r = transform(DEFAULT_INPUT, arithmeticRewrite, {}, 20);
  assert.equal(r.root.type, 'Num');
  assert.equal(r.root.value, 3);
});

test('parse-ast-transformer 不可变：原树不变', () => {
  const before = BIN('+', N(1), N(2));
  const snapshot = JSON.stringify(before);
  transform(before, arithmeticRewrite, {}, 5);
  assert.equal(JSON.stringify(before), snapshot);
});

test('parse-ast-transformer 非数字节点保留', () => {
  const t: AstNode = { type: 'Var', value: 'x' };
  const r = transform(t, arithmeticRewrite, {}, 5);
  assert.equal(r.root.type, 'Var');
});

test('parse-ast-transformer sameTree', () => {
  assert.ok(sameTree(N(1), N(1)));
  assert.ok(!sameTree(N(1), N(2)));
  assert.ok(!sameTree(N(1), { type: 'Var' }));
});

test('parse-ast-transformer nodeCount', () => {
  assert.equal(nodeCount(N(1)), 1);
  assert.equal(nodeCount(BIN('+', N(1), N(2))), 3);
});

test('parse-ast-transformer 钩子', () => {
  let rewrites = 0;
  let results = 0;
  const hooks: RewriteHooks = {
    onRewrite: () => rewrites++,
    onResult: () => results++,
  };
  transform(BIN('+', N(1), N(2)), arithmeticRewrite, hooks, 5);
  assert.ok(rewrites >= 1);
  assert.equal(results, 1);
});

test('buildTrace 生成 tree 帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
  for (const f of frames) assert.ok(f.tree);
  const last = frames[frames.length - 1]!;
  const res = last.aux!.find((e) => e.label === '结果');
  assert.ok(res);
  assert.equal(res!.value, '3');
});
