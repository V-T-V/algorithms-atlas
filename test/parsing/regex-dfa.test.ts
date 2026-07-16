import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  subsetConstruction,
  dfaMatch,
  epsilonClosure,
  move,
  alphabetOf,
  SAMPLE_NFA,
  SIMPLE_NFA,
  type EpsilonNfa,
} from '../../src/algorithms/parsing/regex-dfa/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/parsing/regex-dfa/trace.ts';

test('regex-dfa (a|b)*ab 接受 ab', () => {
  const dfa = subsetConstruction(SAMPLE_NFA);
  assert.equal(dfaMatch('ab', dfa), true);
});

test('regex-dfa (a|b)*ab 接受 aab', () => {
  const dfa = subsetConstruction(SAMPLE_NFA);
  assert.equal(dfaMatch('aab', dfa), true);
});

test('regex-dfa (a|b)*ab 接受 babab', () => {
  const dfa = subsetConstruction(SAMPLE_NFA);
  assert.equal(dfaMatch('babab', dfa), true);
});

test('regex-dfa (a|b)*ab 接受 bbbab', () => {
  const dfa = subsetConstruction(SAMPLE_NFA);
  assert.equal(dfaMatch('bbbab', dfa), true);
});

test('regex-dfa (a|b)*ab 拒绝 a（缺 b）', () => {
  const dfa = subsetConstruction(SAMPLE_NFA);
  assert.equal(dfaMatch('a', dfa), false);
});

test('regex-dfa (a|b)*ab 拒绝空串', () => {
  const dfa = subsetConstruction(SAMPLE_NFA);
  assert.equal(dfaMatch('', dfa), false);
});

test('regex-dfa (a|b)*ab 拒绝 abb（最后是 bb）', () => {
  const dfa = subsetConstruction(SAMPLE_NFA);
  assert.equal(dfaMatch('abb', dfa), false);
});

test('regex-dfa 简单 NFA a*b 接受 b', () => {
  const dfa = subsetConstruction(SIMPLE_NFA);
  assert.equal(dfaMatch('b', dfa), true);
});

test('regex-dfa 简单 NFA a*b 接受 aaab', () => {
  const dfa = subsetConstruction(SIMPLE_NFA);
  assert.equal(dfaMatch('aaab', dfa), true);
});

test('regex-dfa 简单 NFA a*b 拒绝 a', () => {
  const dfa = subsetConstruction(SIMPLE_NFA);
  assert.equal(dfaMatch('a', dfa), false);
});

test('regex-dfa epsilonClosure 含起始自身', () => {
  const c = epsilonClosure([0], SAMPLE_NFA);
  assert.ok(c.has(0));
});

test('regex-dfa epsilonClosure(SAMPLE 0) 含 {0,1,2,4,7}', () => {
  const c = epsilonClosure([0], SAMPLE_NFA);
  for (const s of [0, 1, 2, 4, 7]) {
    assert.ok(c.has(s), `闭包应含 ${s}`);
  }
});

test('regex-dfa move 正确', () => {
  // 从 {0,1,2,4,7} 经 'a' 应到达 {3,8}
  const c = epsilonClosure([0], SAMPLE_NFA);
  const m = move(c, 'a', SAMPLE_NFA);
  assert.ok(m.has(3));
  assert.ok(m.has(8));
});

test('regex-dfa alphabetOf = {a, b}', () => {
  assert.deepEqual(alphabetOf(SAMPLE_NFA), ['a', 'b']);
});

test('regex-dfa DFA 状态数 ≤ NFA 状态数（子集）', () => {
  const dfa = subsetConstruction(SAMPLE_NFA);
  assert.ok(dfa.states <= Math.pow(2, SAMPLE_NFA.states));
});

test('regex-dfa DFA 起始为 0', () => {
  const dfa = subsetConstruction(SAMPLE_NFA);
  assert.equal(dfa.start, 0);
});

test('regex-dfa 钩子 onDiscover/onAccept 触发', () => {
  let discovers = 0;
  let accepts = 0;
  subsetConstruction(SAMPLE_NFA, {
    onDiscover: () => discovers++,
    onAccept: () => accepts++,
  });
  assert.ok(discovers >= 1);
  assert.ok(accepts >= 1);
});

test('regex-dfa 自定义 NFA：单字符 a', () => {
  const nfa: EpsilonNfa = {
    states: 2,
    start: 0,
    accept: 1,
    transitions: [{ from: 0, to: 1, symbol: 'a' }],
  };
  const dfa = subsetConstruction(nfa);
  assert.equal(dfaMatch('a', dfa), true);
  assert.equal(dfaMatch('b', dfa), false);
  assert.equal(dfaMatch('', dfa), false);
});

test('buildTrace 含 array2d，末帧含匹配结果', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.aux, '首帧含 aux');
  const last = frames[frames.length - 1]!;
  const res = last.aux!.find((e) => e.label === '匹配结果');
  assert.ok(res, '末帧应含匹配结果');
});
