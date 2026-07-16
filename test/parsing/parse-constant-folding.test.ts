import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  constantFold,
  nodeCount,
  type AstNode,
} from '../../src/algorithms/parsing/parse-constant-folding/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/parse-constant-folding/trace.ts';

const N = (v: number): AstNode => ({ type: 'Num', value: v });
const B = (v: boolean): AstNode => ({ type: 'Bool', value: v });
const S = (v: string): AstNode => ({ type: 'Str', value: v });
const BIN = (op: string, l: AstNode, r: AstNode): AstNode => ({
  type: 'BinOp',
  value: op,
  children: [l, r],
});
const UN = (op: string, c: AstNode): AstNode => ({ type: 'UnaryOp', value: op, children: [c] });

test('constantFold 简单加法 1+2 → 3', () => {
  const r = constantFold(BIN('+', N(1), N(2)));
  assert.equal(r.root.type, 'Num');
  assert.equal(r.root.value, 3);
  assert.ok(r.totalFolds >= 1);
});

test('constantFold 嵌套 (1+2)*(3-1) → 6', () => {
  const ast = BIN('*', BIN('+', N(1), N(2)), BIN('-', N(3), N(1)));
  const r = constantFold(ast);
  assert.equal(r.root.type, 'Num');
  assert.equal(r.root.value, 6);
});

test('constantFold 一元负号 -5 → -5', () => {
  const r = constantFold(UN('-', N(5)));
  assert.equal(r.root.type, 'Num');
  assert.equal(r.root.value, -5);
});

test('constantFold 含变量不折叠该子树', () => {
  // (1+2) + x  —— x 不是字面量，只有 1+2 折叠为 3
  const ast = BIN('+', BIN('+', N(1), N(2)), { type: 'Var', value: 'x' });
  const r = constantFold(ast);
  // 根仍是 BinOp（因为右侧非字面量）
  assert.equal(r.root.type, 'BinOp');
  // 左子应被折叠为 3
  const left = r.root.children![0]!;
  assert.equal(left.type, 'Num');
  assert.equal(left.value, 3);
});

test('constantFold 布尔运算 true and false → false', () => {
  const r = constantFold(BIN('and', B(true), B(false)));
  assert.equal(r.root.type, 'Bool');
  assert.equal(r.root.value, false);
});

test('constantFold 字符串拼接 "a"+"b" → "ab"', () => {
  const r = constantFold(BIN('+', S('a'), S('b')));
  assert.equal(r.root.type, 'Str');
  assert.equal(r.root.value, 'ab');
});

test('constantFold 除零不被折叠', () => {
  const r = constantFold(BIN('/', N(5), N(0)));
  // 除以 0 时 evalBinop 返回 undefined，不折叠
  assert.equal(r.root.type, 'BinOp');
});

test('constantFold 多轮嵌套 (1+2)+(3+4) → 10', () => {
  const ast = BIN('+', BIN('+', N(1), N(2)), BIN('+', N(3), N(4)));
  const r = constantFold(ast);
  assert.equal(r.root.value, 10);
});

test('constantFold 折叠后节点数减少', () => {
  const ast = BIN('+', BIN('+', N(1), N(2)), BIN('+', N(3), N(4)));
  const before = nodeCount(ast);
  const r = constantFold(ast);
  const after = nodeCount(r.root);
  assert.ok(after < before, `before=${before}, after=${after}`);
});

test('constantFold 钩子触发', () => {
  let folds = 0;
  let passes = 0;
  let results = 0;
  constantFold(BIN('+', N(1), N(2)), 20, {
    onFold: () => folds++,
    onPass: () => passes++,
    onResult: () => results++,
  });
  assert.ok(folds >= 1);
  assert.ok(passes >= 1);
  assert.equal(results, 1);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 2);
  // 至少有一帧带 aux
  const hasAux = frames.some((f) => f.aux && f.aux.length > 0);
  assert.ok(hasAux);
});
