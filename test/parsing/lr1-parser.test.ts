import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  lr1Parse,
  buildTable,
  buildItemSets,
  computeFirst,
  makeSampleGrammar,
  augment,
  type Production,
} from '../../src/algorithms/parsing/lr1-parser/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/parsing/lr1-parser/trace.ts';

test('lr1-parser 接受 cdd（S→CC, C→cC|d）', () => {
  const g = makeSampleGrammar();
  assert.equal(lr1Parse(['c', 'd', 'd'], g).accepted, true);
});

test('lr1-parser 接受 dd', () => {
  const g = makeSampleGrammar();
  assert.equal(lr1Parse(['d', 'd'], g).accepted, true);
});

test('lr1-parser 接受 cdcd', () => {
  const g = makeSampleGrammar();
  assert.equal(lr1Parse(['c', 'd', 'c', 'd'], g).accepted, true);
});

test('lr1-parser 接受 ccccdd', () => {
  const g = makeSampleGrammar();
  assert.equal(lr1Parse(['c', 'c', 'c', 'c', 'd', 'd'], g).accepted, true);
});

test('lr1-parser 拒绝 d（单个 C 不足）', () => {
  const g = makeSampleGrammar();
  assert.equal(lr1Parse(['d'], g).accepted, false);
});

test('lr1-parser 拒绝空输入', () => {
  const g = makeSampleGrammar();
  assert.equal(lr1Parse([], g).accepted, false);
});

test('lr1-parser 拒绝 c（缺 d）', () => {
  const g = makeSampleGrammar();
  assert.equal(lr1Parse(['c'], g).accepted, false);
});

test('lr1-parser 经典文法 S→CC 状态数为 10', () => {
  // 经典结果：LR(1) 有 10 个状态，LALR 合并为 7
  const g = makeSampleGrammar();
  const { sets } = buildItemSets(g);
  assert.equal(sets.length, 10);
});

test('lr1-parser 表无冲突', () => {
  const g = makeSampleGrammar();
  const { table } = buildTable(g);
  assert.equal(table.conflicts, 0);
});

test('lr1-parser FIRST(C) 含 c, d', () => {
  const g = makeSampleGrammar();
  const first = computeFirst(g);
  const fc = first.get('C')!;
  assert.ok(fc.has('c'));
  assert.ok(fc.has('d'));
});

test('lr1-parser 钩子触发', () => {
  const g = makeSampleGrammar();
  let shifts = 0,
    reduces = 0,
    accepted = false;
  lr1Parse(['d', 'd'], g, {
    onShift: () => shifts++,
    onReduce: () => reduces++,
    onAccept: () => (accepted = true),
  });
  assert.ok(shifts >= 2);
  assert.ok(reduces >= 1);
  assert.equal(accepted, true);
});

test('lr1-parser 自定义文法', () => {
  const prods: Production[] = [
    { lhs: 'S', rhs: ['a', 'B'] },
    { lhs: 'B', rhs: ['b'] },
  ];
  const g = augment(prods, 'S', ['S', 'B'], ['a', 'b']);
  assert.equal(lr1Parse(['a', 'b'], g).accepted, true);
  assert.equal(lr1Parse(['b', 'a'], g).accepted, false);
});

test("lr1-parser augment 产生式 0 为 S'→S", () => {
  const g = augment([{ lhs: 'S', rhs: ['a'] }], 'S', ['S'], ['a']);
  assert.equal(g.productions[0]!.lhs, "S'");
});

test('buildTrace 含 array2d，末帧含结果', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.aux, '首帧含 aux');
  const last = frames[frames.length - 1]!;
  const res = last.aux!.find((e) => e.label === '结果');
  assert.ok(res, '末帧应含结果');
});
