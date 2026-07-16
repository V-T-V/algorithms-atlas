import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  areEquivalent,
  type DFA,
  type EquivalenceHooks,
} from '../../src/algorithms/parsing/parse-regex-equivalent/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/parsing/parse-regex-equivalent/trace.ts';

// A: a+  B: a·a*  → 等价
const A_PLUS: DFA = DEFAULT_INPUT.a;
const A_STAR: DFA = DEFAULT_INPUT.b;

test('parse-regex-equivalent a+ 与 a·a* 等价', () => {
  const r = areEquivalent(A_PLUS, A_STAR);
  assert.equal(r.equivalent, true);
});

test('parse-regex-equivalent a+ 与 a* 不等价', () => {
  const aStar: DFA = {
    states: ['s0'],
    alphabet: ['a'],
    transitions: { s0: { a: 's0' } },
    start: 's0',
    accept: ['s0'],
  };
  const r = areEquivalent(A_PLUS, aStar);
  assert.equal(r.equivalent, false);
  // 反例应是空串（a* 接受空串，a+ 不接受）
  assert.equal(r.counterexample.join(''), '');
});

test('parse-regex-equivalent 给出最短区分串', () => {
  // A: a, B: ab —— 串 'a' 区分（A 接受 a，B 不接受 a）
  const aOnly: DFA = {
    states: ['s0', 's1'],
    alphabet: ['a'],
    transitions: { s0: { a: 's1' }, s1: { a: 's1' } },
    start: 's0',
    accept: ['s1'],
  };
  const ab: DFA = {
    states: ['t0', 't1'],
    alphabet: ['a', 'b'],
    transitions: { t0: { a: 't1' }, t1: { b: 't1' } },
    start: 't0',
    accept: [],
  };
  const r = areEquivalent(aOnly, ab);
  assert.equal(r.equivalent, false);
  assert.equal(r.counterexample.join(''), 'a');
});

test('parse-regex-equivalent 相同 DFA 等价', () => {
  const r = areEquivalent(A_PLUS, A_PLUS);
  assert.equal(r.equivalent, true);
});

test('parse-regex-equivalent 不同字母表', () => {
  const x: DFA = {
    states: ['s0'],
    alphabet: ['a', 'b'],
    transitions: { s0: { a: 's0', b: 's0' } },
    start: 's0',
    accept: ['s0'],
  };
  const y: DFA = {
    states: ['t0'],
    alphabet: ['a'],
    transitions: { t0: { a: 't0' } },
    start: 't0',
    accept: ['t0'],
  };
  // x 接受 (a|b)*，y 接受 a*，但 y 对 b 落入陷阱；x 接受 b
  const r = areEquivalent(x, y);
  assert.equal(r.equivalent, false);
  assert.equal(r.counterexample.join(''), 'b');
});

test('parse-regex-equivalent explored >= 1', () => {
  const r = areEquivalent(A_PLUS, A_STAR);
  assert.ok(r.explored >= 1);
});

test('parse-regex-equivalent 钩子', () => {
  let visits = 0;
  let results = 0;
  const hooks: EquivalenceHooks = {
    onVisit: () => visits++,
    onResult: () => results++,
  };
  areEquivalent(A_PLUS, A_STAR, hooks);
  assert.ok(visits >= 1);
  assert.equal(results, 1);
});

test('buildTrace 生成 aux 帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
  for (const f of frames) assert.ok(f.aux);
  const last = frames[frames.length - 1]!;
  const verdict = last.aux!.find((e) => e.label === '结论');
  assert.ok(verdict);
  assert.equal(verdict!.value, 'EQUIVALENT');
});
