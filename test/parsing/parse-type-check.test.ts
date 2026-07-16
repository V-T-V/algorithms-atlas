import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  typeCheck,
  type AstNode,
  type CheckHooks,
} from '../../src/algorithms/parsing/parse-type-check/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/parsing/parse-type-check/trace.ts';

const N = (v: number): AstNode => ({ type: 'Num', value: v });
const B = (v: boolean): AstNode => ({ type: 'Bool', value: v });
const S = (v: string): AstNode => ({ type: 'Str', value: v });
const BIN = (op: string, l: AstNode, r: AstNode): AstNode => ({
  type: 'BinOp',
  value: op,
  children: [l, r],
});

test('parse-type-check 整数字面量', () => {
  const r = typeCheck(N(5));
  assert.equal(r.rootType, 'int');
  assert.equal(r.errors.length, 0);
});

test('parse-type-check 浮点字面量', () => {
  const r = typeCheck(N(5.5));
  assert.equal(r.rootType, 'float');
});

test('parse-type-check 布尔字面量', () => {
  assert.equal(typeCheck(B(true)).rootType, 'bool');
});

test('parse-type-check 字符串字面量', () => {
  assert.equal(typeCheck(S('hi')).rootType, 'string');
});

test('parse-type-check int + int = int', () => {
  assert.equal(typeCheck(BIN('+', N(1), N(2))).rootType, 'int');
});

test('parse-type-check int + float = float（提升）', () => {
  assert.equal(typeCheck(BIN('+', N(1), N(2.5))).rootType, 'float');
});

test('parse-type-check 比较 < 返回 bool', () => {
  assert.equal(typeCheck(BIN('<', N(1), N(2))).rootType, 'bool');
});

test('parse-type-check 算术作用于 string 报错', () => {
  const r = typeCheck(BIN('+', S('a'), N(1)));
  assert.equal(r.rootType, 'error');
  assert.ok(r.errors.length >= 1);
});

test('parse-type-check 逻辑 and', () => {
  assert.equal(typeCheck(BIN('and', B(true), B(false))).rootType, 'bool');
});

test('parse-type-check 逻辑 and 作用于 int 报错', () => {
  const r = typeCheck(BIN('and', B(true), N(1)));
  assert.equal(r.rootType, 'error');
});

test('parse-type-check 一元负号', () => {
  const r = typeCheck({ type: 'UnaryOp', value: '-', children: [N(3)] });
  assert.equal(r.rootType, 'int');
});

test('parse-type-check 一元 not 作用于 int 报错', () => {
  const r = typeCheck({ type: 'UnaryOp', value: 'not', children: [N(3)] });
  assert.equal(r.rootType, 'error');
});

test('parse-type-check If 两支一致', () => {
  const r = typeCheck({ type: 'If', children: [B(true), N(1), N(2)] });
  assert.equal(r.rootType, 'int');
});

test('parse-type-check If 条件非 bool 报错', () => {
  const r = typeCheck({ type: 'If', children: [N(1), N(2), N(3)] });
  assert.ok(r.errors.length >= 1);
});

test('parse-type-check 默认演示 (1+2)<(3*4) = bool', () => {
  const r = typeCheck(DEFAULT_INPUT);
  assert.equal(r.rootType, 'bool');
  assert.equal(r.errors.length, 0);
});

test('parse-type-check nodeTypes 覆盖所有节点', () => {
  const r = typeCheck(DEFAULT_INPUT);
  // 根 + 2 子 BinOp + 4 叶子 = 7 节点
  assert.equal(r.nodeTypes.size, 7);
});

test('parse-type-check 钩子', () => {
  let infers = 0;
  let results = 0;
  const hooks: CheckHooks = {
    onInfer: () => infers++,
    onResult: () => results++,
  };
  typeCheck(DEFAULT_INPUT, hooks);
  assert.ok(infers >= 7);
  assert.equal(results, 1);
});

test('buildTrace 生成 tree 帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
  for (const f of frames) assert.ok(f.tree);
  const last = frames[frames.length - 1]!;
  const rt = last.aux!.find((e) => e.label === '根类型');
  assert.equal(rt!.value, 'bool');
});
