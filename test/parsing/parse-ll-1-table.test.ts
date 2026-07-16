import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildLL1Table,
  computeFirst,
  computeFollow,
  prodStr,
  type CFG,
  type TableHooks,
} from '../../src/algorithms/parsing/parse-ll-1-table/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/parsing/parse-ll-1-table/trace.ts';

const G: CFG = DEFAULT_INPUT;

test('parse-ll-1-table 经典文法是 LL(1)', () => {
  const t = buildLL1Table(G);
  assert.equal(t.isLL1, true);
  assert.equal(t.conflicts.length, 0);
});

test('parse-ll-1-table FIRST(E) 含 ( 和 id', () => {
  const { first } = computeFirst(G);
  assert.ok(first['E']!.has('('));
  assert.ok(first['E']!.has('id'));
});

test("parse-ll-1-table E' 可空（FIRST 含 ε）", () => {
  const { first } = computeFirst(G);
  assert.ok(first["E'"]!.has('ε'));
});

test('parse-ll-1-table FOLLOW(E) 含 $ 和 )', () => {
  const { first } = computeFirst(G);
  const follow = computeFollow(G, first);
  assert.ok(follow['E']!.has('$'));
  assert.ok(follow['E']!.has(')'));
});

test('parse-ll-1-table FOLLOW(F) 含 + * $ )', () => {
  const { first } = computeFirst(G);
  const follow = computeFollow(G, first);
  assert.ok(follow['F']!.has('+'));
  assert.ok(follow['F']!.has('*'));
  assert.ok(follow['F']!.has('$'));
  assert.ok(follow['F']!.has(')'));
});

test("parse-ll-1-table M[E][(] = E → T E'", () => {
  const t = buildLL1Table(G);
  const cell = t.cells['E']!['(']!;
  assert.equal(cell.length, 1);
  assert.equal(prodStr(cell[0]!), "E → T E'");
});

test("parse-ll-1-table M[E][id] = E → T E'", () => {
  const t = buildLL1Table(G);
  const cell = t.cells['E']!['id']!;
  assert.equal(cell.length, 1);
});

test('parse-ll-1-table 冲突文法非 LL(1)', () => {
  // S → A | A a；A → 'x'，A 的 FIRST 含 x，导致 FIRST/FIRST 冲突
  const g: CFG = {
    start: 'S',
    nonTerminals: new Set(['S', 'A']),
    productions: [
      { lhs: 'S', rhs: ['A'] },
      { lhs: 'S', rhs: ['A', 'a'] },
      { lhs: 'A', rhs: ['x'] },
    ],
  };
  const t = buildLL1Table(g);
  assert.equal(t.isLL1, false);
  assert.ok(t.conflicts.length >= 1);
});

test('parse-ll-1-table ε 候选填入 FOLLOW 列', () => {
  const t = buildLL1Table(G);
  // E' → ε 应出现在 FOLLOW(E') 的列：+ $ )
  const epsInPlus = t.cells["E'"]!['+']!.some((p) => p.rhs.length === 0);
  const epsInDollar = t.cells["E'"]!['$']!.some((p) => p.rhs.length === 0);
  assert.ok(epsInPlus, "E'→ε 应在 + 列");
  assert.ok(epsInDollar, "E'→ε 应在 $ 列");
});

test('parse-ll-1-table 钩子触发', () => {
  let firsts = 0;
  let follows = 0;
  let cells = 0;
  let results = 0;
  const hooks: TableHooks = {
    onFirst: () => firsts++,
    onFollow: () => follows++,
    onCell: () => cells++,
    onResult: () => results++,
  };
  buildLL1Table(G, hooks);
  assert.ok(firsts >= 5);
  assert.ok(follows >= 5);
  assert.ok(cells >= 8);
  assert.equal(results, 1);
});

test('buildTrace 生成 grid + aux', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 4);
  const last = frames[frames.length - 1]!;
  assert.ok(last.array2d, '终态应有 grid');
  assert.ok(last.aux);
  const verdict = last.aux!.find((e) => e.label === '判定');
  assert.ok(verdict);
  assert.equal(verdict!.value, 'LL(1)');
});

test('buildTrace 冲突文法标记 warn', () => {
  const g: CFG = {
    start: 'S',
    nonTerminals: new Set(['S', 'A']),
    productions: [
      { lhs: 'S', rhs: ['A'] },
      { lhs: 'S', rhs: ['A', 'a'] },
      { lhs: 'A', rhs: ['x'] },
    ],
  };
  const frames = buildTrace(g);
  const last = frames[frames.length - 1]!;
  const verdict = last.aux!.find((e) => e.label === '判定');
  assert.equal(verdict!.value, '非 LL(1)');
});
