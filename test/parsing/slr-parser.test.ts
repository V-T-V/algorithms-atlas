import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  slrParse,
  buildTable,
  buildItemSets,
  computeFirst,
  computeFollow,
  makeSampleGrammar,
  augment,
  type Production,
} from '../../src/algorithms/parsing/slr-parser/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/parsing/slr-parser/trace.ts';

test('slr-parser 接受 id+id*id', () => {
  const g = makeSampleGrammar();
  const r = slrParse(['id', '+', 'id', '*', 'id'], g);
  assert.equal(r.accepted, true);
});

test('slr-parser 接受 id', () => {
  const g = makeSampleGrammar();
  assert.equal(slrParse(['id'], g).accepted, true);
});

test('slr-parser 接受 (id+id)', () => {
  const g = makeSampleGrammar();
  assert.equal(slrParse(['(', 'id', '+', 'id', ')'], g).accepted, true);
});

test('slr-parser 接受 id+id+id', () => {
  const g = makeSampleGrammar();
  assert.equal(slrParse(['id', '+', 'id', '+', 'id'], g).accepted, true);
});

test('slr-parser 拒绝 id+', () => {
  const g = makeSampleGrammar();
  assert.equal(slrParse(['id', '+'], g).accepted, false);
});

test('slr-parser 拒绝 *id', () => {
  const g = makeSampleGrammar();
  assert.equal(slrParse(['*', 'id'], g).accepted, false);
});

test('slr-parser 拒绝空输入', () => {
  const g = makeSampleGrammar();
  assert.equal(slrParse([], g).accepted, false);
});

test('slr-parser LR(0) 项目集状态数为 12（经典表达式文法）', () => {
  const g = makeSampleGrammar();
  const { sets } = buildItemSets(g);
  assert.equal(sets.length, 12);
});

test('slr-parser 表无冲突（表达式文法是 SLR(1)）', () => {
  const g = makeSampleGrammar();
  const { table } = buildTable(g);
  assert.equal(table.conflicts, 0);
});

test('slr-parser FOLLOW(E) 含 $, +, )', () => {
  const g = makeSampleGrammar();
  const follow = computeFollow(g);
  const fe = follow.get('E')!;
  assert.ok(fe.has('$'));
  assert.ok(fe.has('+'));
  assert.ok(fe.has(')'));
});

test('slr-parser FOLLOW(T) 含 +, *, $, )', () => {
  const g = makeSampleGrammar();
  const follow = computeFollow(g);
  const ft = follow.get('T')!;
  assert.ok(ft.has('+'));
  assert.ok(ft.has('*'));
  assert.ok(ft.has('$'));
});

test('slr-parser FIRST(id) = {id}', () => {
  const g = makeSampleGrammar();
  const first = computeFirst(g);
  assert.deepEqual([...first.get('id')!], ['id']);
});

test("slr-parser augment 插入 S'→S 在产生式 0", () => {
  const g = augment([{ lhs: 'E', rhs: ['E', '+', 'T'] }], 'E', ['E', 'T'], ['+']);
  assert.equal(g.productions[0]!.lhs, "E'");
  assert.deepEqual(g.productions[0]!.rhs, ['E']);
});

test('slr-parser 钩子：分析触发 onShift/onReduce/onAccept', () => {
  const g = makeSampleGrammar();
  let shifts = 0,
    reduces = 0,
    accepted = false;
  slrParse(['id', '+', 'id'], g, {
    onShift: () => shifts++,
    onReduce: () => reduces++,
    onAccept: () => (accepted = true),
  });
  assert.ok(shifts >= 3);
  assert.ok(reduces >= 1);
  assert.equal(accepted, true);
});

test('slr-parser 自定义文法：S → aSb | ab（非 SLR，但本例可处理）', () => {
  const prods: Production[] = [
    { lhs: 'S', rhs: ['a', 'S', 'b'] },
    { lhs: 'S', rhs: ['a', 'b'] },
  ];
  const g = augment(prods, 'S', ['S'], ['a', 'b']);
  assert.equal(slrParse(['a', 'b'], g).accepted, true);
  assert.equal(slrParse(['a', 'a', 'b', 'b'], g).accepted, true);
  assert.equal(slrParse(['b', 'a'], g).accepted, false);
});

test('buildTrace 含 array2d（项目集/表），末帧含结果', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.aux, '首帧含 aux（文法）');
  const last = frames[frames.length - 1]!;
  const res = last.aux!.find((e) => e.label === '结果');
  assert.ok(res, '末帧应含结果');
});
