import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  computeFirst,
  firstOfString,
  type CFG,
  type FirstHooks,
} from '../../src/algorithms/parsing/parse-first-set/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/parsing/parse-first-set/trace.ts';

const G: CFG = DEFAULT_INPUT;

test('parse-first-set A 的 FIRST 含 a 和 ε', () => {
  const r = computeFirst(G);
  assert.ok(r.first['A']!.has('a'));
  assert.ok(r.first['A']!.has('ε'));
});

test('parse-first-set B 的 FIRST 含 b 和 ε', () => {
  const r = computeFirst(G);
  assert.ok(r.first['B']!.has('b'));
  assert.ok(r.first['B']!.has('ε'));
});

test('parse-first-set S → A B 的 FIRST 含 a b ε', () => {
  const r = computeFirst(G);
  // A,B 都可空，故 S 可空
  assert.ok(r.first['S']!.has('a'));
  assert.ok(r.first['S']!.has('b'));
  assert.ok(r.first['S']!.has('ε'));
});

test('parse-first-set 不动点收敛', () => {
  const r = computeFirst(G);
  assert.ok(r.iterations >= 1);
  assert.equal(r.history.length, r.iterations + 1);
});

test('parse-first-set firstOfString', () => {
  const r = computeFirst(G);
  const s = firstOfString(G, r.first, ['A', 'B']);
  assert.ok(s.has('a'));
  assert.ok(s.has('b'));
  assert.ok(s.has('ε'));
});

test('parse-first-set 终结符串', () => {
  const r = computeFirst(G);
  const s = firstOfString(G, r.first, ['x', 'A']);
  assert.ok(s.has('x'));
  assert.ok(!s.has('ε'));
});

test('parse-first-set 钩子触发', () => {
  let passes = 0;
  let adds = 0;
  let results = 0;
  const hooks: FirstHooks = {
    onPass: () => passes++,
    onAdd: () => adds++,
    onResult: () => results++,
  };
  computeFirst(G, hooks);
  assert.ok(passes >= 2);
  assert.ok(adds >= 1);
  assert.equal(results, 1);
});

test('parse-first-set 无 ε 文法', () => {
  const g: CFG = {
    start: 'S',
    nonTerminals: new Set(['S']),
    productions: [
      { lhs: 'S', rhs: ['a', 'S'] },
      { lhs: 'S', rhs: ['a'] },
    ],
  };
  const r = computeFirst(g);
  assert.ok(r.first['S']!.has('a'));
  assert.ok(!r.first['S']!.has('ε'));
});

test('buildTrace 生成 grid + aux', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
  const last = frames[frames.length - 1]!;
  assert.ok(last.array2d);
  assert.ok(last.aux);
});
