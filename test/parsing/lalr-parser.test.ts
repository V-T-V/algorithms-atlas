import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  lalrParse,
  buildLalrTable,
  buildLalrItemSets,
  buildLr1TableForComparison,
  makeSampleGrammar,
  augment,
  type Production,
} from '../../src/algorithms/parsing/lalr-parser/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/parsing/lalr-parser/trace.ts';

test('lalr-parser 接受 cdd', () => {
  const g = makeSampleGrammar();
  assert.equal(lalrParse(['c', 'd', 'd'], g).accepted, true);
});

test('lalr-parser 接受 dd', () => {
  const g = makeSampleGrammar();
  assert.equal(lalrParse(['d', 'd'], g).accepted, true);
});

test('lalr-parser 接受 ccccdd', () => {
  const g = makeSampleGrammar();
  assert.equal(lalrParse(['c', 'c', 'c', 'c', 'd', 'd'], g).accepted, true);
});

test('lalr-parser 拒绝 d（单个 C 不足）', () => {
  const g = makeSampleGrammar();
  assert.equal(lalrParse(['d'], g).accepted, false);
});

test('lalr-parser 拒绝空输入', () => {
  const g = makeSampleGrammar();
  assert.equal(lalrParse([], g).accepted, false);
});

test('lalr-parser LALR 状态数 < LR(1) 状态数（同心合并）', () => {
  const g = makeSampleGrammar();
  const { sets } = buildLalrItemSets(g);
  const lr1 = buildLr1TableForComparison(g);
  assert.ok(sets.length < lr1.count, `LALR ${sets.length} 应少于 LR(1) ${lr1.count}`);
});

test('lalr-parser 经典文法 S→CC LALR 状态数 = 7', () => {
  const g = makeSampleGrammar();
  const { sets } = buildLalrItemSets(g);
  assert.equal(sets.length, 7);
});

test('lalr-parser 表无冲突（教学文法）', () => {
  const g = makeSampleGrammar();
  const { table } = buildLalrTable(g);
  assert.equal(table.conflicts, 0);
});

test('lalr-parser 钩子触发', () => {
  const g = makeSampleGrammar();
  let shifts = 0,
    reduces = 0,
    accepted = false;
  lalrParse(['d', 'd'], g, {
    onShift: () => shifts++,
    onReduce: () => reduces++,
    onAccept: () => (accepted = true),
  });
  assert.ok(shifts >= 2);
  assert.ok(reduces >= 1);
  assert.equal(accepted, true);
});

test('lalr-parser 自定义文法', () => {
  const prods: Production[] = [
    { lhs: 'S', rhs: ['a', 'B'] },
    { lhs: 'B', rhs: ['b'] },
  ];
  const g = augment(prods, 'S', ['S', 'B'], ['a', 'b']);
  assert.equal(lalrParse(['a', 'b'], g).accepted, true);
  assert.equal(lalrParse(['a', 'a'], g).accepted, false);
});

test("lalr-parser augment 产生式 0 为 S'→S", () => {
  const g = augment([{ lhs: 'S', rhs: ['a'] }], 'S', ['S'], ['a']);
  assert.equal(g.productions[0]!.lhs, "S'");
});

test('buildTrace 含 array2d，末帧含结果与对比', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.aux, '首帧含 aux');
  const last = frames[frames.length - 1]!;
  const res = last.aux!.find((e) => e.label === '结果');
  assert.ok(res, '末帧应含结果');
  const lalrCount = last.aux!.find((e) => e.label === 'LALR 状态数');
  assert.ok(lalrCount, '末帧应含 LALR 状态数');
});
