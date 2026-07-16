import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  detectSLRConflicts,
  type CFG,
  type SLRHooks,
} from '../../src/algorithms/parsing/parse-slConflict/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/parsing/parse-slConflict/trace.ts';

// 二义文法 S → a | S ; S：对 ; 存在 shift/reduce 冲突
const G: CFG = DEFAULT_INPUT;

test('parse-slConflict 构造了 LR(0) 状态', () => {
  const r = detectSLRConflicts(G);
  assert.ok(r.states.length >= 2);
});

test('parse-slConflict 二义文法有冲突', () => {
  const r = detectSLRConflicts(G);
  assert.equal(r.isSLR1, false);
  assert.ok(r.conflicts.length >= 1);
  // 应含 shift-reduce
  assert.ok(r.conflicts.some((c) => c.kind === 'shift-reduce'));
});

test('parse-slConflict 无冲突文法是 SLR(1)', () => {
  const g: CFG = {
    start: 'S',
    nonTerminals: new Set(['S', 'A']),
    productions: [
      { lhs: 'S', rhs: ['A'] },
      { lhs: 'A', rhs: ['a'] },
      { lhs: 'A', rhs: ['b'] },
    ],
  };
  const r = detectSLRConflicts(g);
  assert.equal(r.isSLR1, true);
  assert.equal(r.conflicts.length, 0);
});

test('parse-slConflict FOLLOW(S) 含 $', () => {
  const r = detectSLRConflicts(G);
  assert.ok(r.follow['S']!.has('$'));
});

test('parse-slConflict 冲突含终结符 ;', () => {
  const r = detectSLRConflicts(G);
  assert.ok(r.conflicts.some((c) => c.terminal === ';'));
});

test('parse-slConflict goto 关系自洽', () => {
  const r = detectSLRConflicts(G);
  for (const s of r.states) {
    for (const [sym, to] of Object.entries(s.goto)) {
      assert.ok(to >= 0 && to < r.states.length, `goto(${sym})=${to} 越界`);
    }
  }
});

test('parse-slConflict 钩子', () => {
  let states = 0;
  let gotos = 0;
  let conflicts = 0;
  let results = 0;
  const hooks: SLRHooks = {
    onState: () => states++,
    onGoto: () => gotos++,
    onConflict: () => conflicts++,
    onResult: () => results++,
  };
  detectSLRConflicts(G, hooks);
  assert.ok(states >= 2);
  assert.ok(gotos >= 1);
  assert.ok(conflicts >= 1);
  assert.equal(results, 1);
});

test('buildTrace 生成 aux 帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
  for (const f of frames) assert.ok(f.aux);
  const last = frames[frames.length - 1]!;
  const verdict = last.aux!.find((e) => e.label === '判定');
  assert.ok(verdict);
  assert.equal(verdict!.value, '非 SLR(1)');
});
