import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  computeFollow,
  type CFG,
  type FollowHooks,
} from '../../src/algorithms/parsing/parse-follow-set/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/parsing/parse-follow-set/trace.ts';

const G: CFG = DEFAULT_INPUT;

test('parse-follow-set FOLLOW(S) 含 $', () => {
  const r = computeFollow(G);
  assert.ok(r.follow['S']!.has('$'));
});

test('parse-follow-set FOLLOW(A) 含 B 的 FIRST', () => {
  // S → A B；B 的 FIRST = {b, ε}；故 FOLLOW(A) ⊇ {b} 且 ⊇ FOLLOW(S)={$}
  const r = computeFollow(G);
  assert.ok(r.follow['A']!.has('b'));
  assert.ok(r.follow['A']!.has('$'));
});

test('parse-follow-set FOLLOW(B) ⊇ FOLLOW(S)', () => {
  // B 是 S 右部最后一个，故 FOLLOW(B) ⊇ FOLLOW(S) = {$}
  const r = computeFollow(G);
  assert.ok(r.follow['B']!.has('$'));
});

test('parse-follow-set 不动点收敛', () => {
  const r = computeFollow(G);
  assert.ok(r.iterations >= 1);
  assert.equal(r.history.length, r.iterations + 1);
});

test('parse-follow-set 经典表达式文法', () => {
  const g: CFG = {
    start: 'E',
    nonTerminals: new Set(['E', 'T', 'F']),
    productions: [
      { lhs: 'E', rhs: ['T'] },
      { lhs: 'T', rhs: ['T', '+', 'F'] },
      { lhs: 'T', rhs: ['F'] },
      { lhs: 'F', rhs: ['(', 'E', ')'] },
      { lhs: 'F', rhs: ['id'] },
    ],
  };
  const r = computeFollow(g);
  assert.ok(r.follow['E']!.has('$'));
  assert.ok(r.follow['E']!.has(')'));
  assert.ok(r.follow['T']!.has('+'));
  assert.ok(r.follow['F']!.has('+'));
});

test('parse-follow-set 钩子', () => {
  let passes = 0;
  let adds = 0;
  let results = 0;
  const hooks: FollowHooks = {
    onPass: () => passes++,
    onAdd: () => adds++,
    onResult: () => results++,
  };
  computeFollow(G, hooks);
  assert.ok(passes >= 2);
  assert.ok(adds >= 1);
  assert.equal(results, 1);
});

test('buildTrace 生成 grid + aux', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
  const last = frames[frames.length - 1]!;
  assert.ok(last.array2d);
  assert.ok(last.aux);
});
