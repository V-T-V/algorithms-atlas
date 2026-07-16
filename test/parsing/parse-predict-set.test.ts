import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  computePredict,
  prodStr,
  type CFG,
  type PredictHooks,
} from '../../src/algorithms/parsing/parse-predict-set/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/parsing/parse-predict-set/trace.ts';

const G: CFG = DEFAULT_INPUT; // S→A a；A→b | ε

test('parse-predict-set PREDICT(A→b) = {b}', () => {
  const r = computePredict(G);
  const e = r.entries.find((x) => prodStr(x.production) === 'A → b');
  assert.ok(e);
  assert.ok(e!.predict.has('b'));
  assert.ok(!e!.predict.has('ε'));
});

test('parse-predict-set PREDICT(A→ε) = FOLLOW(A)', () => {
  // FOLLOW(A)：S→A a 中 A 后跟 a，故 FOLLOW(A)={a}
  const r = computePredict(G);
  const e = r.entries.find((x) => x.production.rhs.length === 0 && x.production.lhs === 'A');
  assert.ok(e);
  assert.ok(e!.predict.has('a'));
  assert.ok(!e!.predict.has('ε'));
});

test('parse-predict-set PREDICT(S→A a) 含 b（因 A 可空且 FIRST(A)={b}）', () => {
  const r = computePredict(G);
  const e = r.entries.find((x) => x.production.lhs === 'S');
  assert.ok(e);
  // A 可空 → FIRST(A a) = {b, a}
  assert.ok(e!.predict.has('b'));
  assert.ok(e!.predict.has('a'));
});

test('parse-predict-set 该文法是 LL(1)', () => {
  const r = computePredict(G);
  assert.equal(r.isLL1, true);
});

test('parse-predict-set 冲突文法', () => {
  // S → a | a b —— 两条 PREDICT 都含 a
  const g: CFG = {
    start: 'S',
    nonTerminals: new Set(['S']),
    productions: [
      { lhs: 'S', rhs: ['a'] },
      { lhs: 'S', rhs: ['a', 'b'] },
    ],
  };
  const r = computePredict(g);
  assert.equal(r.isLL1, false);
  assert.ok(r.conflicts.length >= 1);
  assert.ok(r.conflicts[0]!.overlap.includes('a'));
});

test('parse-predict-set 钩子', () => {
  let prods = 0;
  let results = 0;
  const hooks: PredictHooks = {
    onProduction: () => prods++,
    onResult: () => results++,
  };
  computePredict(G, hooks);
  assert.ok(prods >= 3);
  assert.equal(results, 1);
});

test('parse-predict-set 钩子 onConflict', () => {
  const g: CFG = {
    start: 'S',
    nonTerminals: new Set(['S']),
    productions: [
      { lhs: 'S', rhs: ['a'] },
      { lhs: 'S', rhs: ['a', 'b'] },
    ],
  };
  let conflicts = 0;
  computePredict(g, { onConflict: () => conflicts++ });
  assert.ok(conflicts >= 1);
});

test('buildTrace 生成 grid + aux', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
  const last = frames[frames.length - 1]!;
  assert.ok(last.array2d);
  assert.ok(last.aux);
  const verdict = last.aux!.find((e) => e.label === '判定');
  assert.ok(verdict);
});
