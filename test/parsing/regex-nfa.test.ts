import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  regexToNfa,
  nfaAccepts,
  epsilonClosure,
  type Nfa,
} from '../../src/algorithms/parsing/regex-nfa/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/regex-nfa/trace.ts';

test('regex-nfa 单字符 a', () => {
  const nfa = regexToNfa('a');
  // 单字符：2 状态
  assert.ok(nfa.states >= 2);
  assert.equal(nfaAccepts(nfa, 'a'), true);
  assert.equal(nfaAccepts(nfa, 'b'), false);
  assert.equal(nfaAccepts(nfa, ''), false);
});

test('regex-nfa 拼接 ab', () => {
  const nfa = regexToNfa('ab');
  assert.equal(nfaAccepts(nfa, 'ab'), true);
  assert.equal(nfaAccepts(nfa, 'a'), false);
  assert.equal(nfaAccepts(nfa, 'ba'), false);
  assert.equal(nfaAccepts(nfa, 'abc'), false);
});

test('regex-nfa 选择 a|b', () => {
  const nfa = regexToNfa('a|b');
  assert.equal(nfaAccepts(nfa, 'a'), true);
  assert.equal(nfaAccepts(nfa, 'b'), true);
  assert.equal(nfaAccepts(nfa, 'c'), false);
  assert.equal(nfaAccepts(nfa, 'ab'), false);
});

test('regex-nfa 星号 a*', () => {
  const nfa = regexToNfa('a*');
  assert.equal(nfaAccepts(nfa, ''), true); // 0 次
  assert.equal(nfaAccepts(nfa, 'a'), true);
  assert.equal(nfaAccepts(nfa, 'aaaa'), true);
  assert.equal(nfaAccepts(nfa, 'b'), false);
});

test('regex-nfa 分组 (ab)*', () => {
  const nfa = regexToNfa('(ab)*');
  assert.equal(nfaAccepts(nfa, ''), true);
  assert.equal(nfaAccepts(nfa, 'ab'), true);
  assert.equal(nfaAccepts(nfa, 'ababab'), true);
  assert.equal(nfaAccepts(nfa, 'aba'), false);
  assert.equal(nfaAccepts(nfa, 'abc'), false);
});

test('regex-nfa 综合 (a|b)*', () => {
  const nfa = regexToNfa('(a|b)*');
  assert.equal(nfaAccepts(nfa, ''), true);
  assert.equal(nfaAccepts(nfa, 'a'), true);
  assert.equal(nfaAccepts(nfa, 'b'), true);
  assert.equal(nfaAccepts(nfa, 'ababba'), true);
  assert.equal(nfaAccepts(nfa, 'abc'), false); // 含 c
});

test('regex-nfa 综合 ab|cd', () => {
  const nfa = regexToNfa('ab|cd');
  assert.equal(nfaAccepts(nfa, 'ab'), true);
  assert.equal(nfaAccepts(nfa, 'cd'), true);
  assert.equal(nfaAccepts(nfa, 'abcd'), false);
  assert.equal(nfaAccepts(nfa, 'a'), false);
});

test('regex-nfa a*b', () => {
  const nfa = regexToNfa('a*b');
  assert.equal(nfaAccepts(nfa, 'b'), true);
  assert.equal(nfaAccepts(nfa, 'ab'), true);
  assert.equal(nfaAccepts(nfa, 'aaab'), true);
  assert.equal(nfaAccepts(nfa, 'aaa'), false);
});

test('regex-nfa 状态数随正则长度增长', () => {
  const n1 = regexToNfa('a');
  const n2 = regexToNfa('ab');
  const n3 = regexToNfa('abc');
  assert.ok(n2.states > n1.states);
  assert.ok(n3.states > n2.states);
});

test('regex-nfa start 与 accept 不同', () => {
  const nfa = regexToNfa('a');
  assert.notEqual(nfa.start, nfa.accept);
});

test('regex-nfa 起始状态至少有 1 个出边', () => {
  const nfa = regexToNfa('a');
  const out = nfa.transitions.filter((t) => t.from === nfa.start);
  assert.ok(out.length >= 1);
});

test('regex-nfa ε-闭包包含自身', () => {
  const nfa = regexToNfa('a*');
  const cl = epsilonClosure(nfa, new Set([nfa.start]));
  assert.ok(cl.has(nfa.start));
  // a* 的 start 应能通过 ε 到达更多状态
  assert.ok(cl.size >= 1);
});

test('regex-nfa 空正则匹配空串', () => {
  const nfa = regexToNfa('');
  assert.equal(nfaAccepts(nfa, ''), true);
  assert.equal(nfaAccepts(nfa, 'a'), false);
});

test('regex-nfa 钩子被调用', () => {
  let fragments = 0;
  let results = 0;
  regexToNfa('(a|b)*', {
    onFragment: () => fragments++,
    onResult: () => results++,
  });
  assert.ok(fragments >= 1);
  assert.equal(results, 1);
});

test('regex-nfa 返回结构完整', () => {
  const nfa: Nfa = regexToNfa('ab');
  assert.ok(typeof nfa.start === 'number');
  assert.ok(typeof nfa.accept === 'number');
  assert.ok(Array.isArray(nfa.transitions));
  assert.ok(nfa.states > 0);
});

test('buildTrace 生成 graph 帧', () => {
  const frames = buildTrace('(a|b)*');
  assert.ok(frames.length >= 3);
  // 终帧应有 graph
  const last = frames[frames.length - 1]!;
  assert.ok(last.graph, '终帧应有 graph');
  assert.ok(last.graph!.nodes.length > 0);
});

test('buildTrace 单字符', () => {
  const frames = buildTrace('a');
  assert.ok(frames.length >= 2);
  const last = frames[frames.length - 1]!;
  assert.ok(last.graph);
  // 单字符 NFA：至少 2 个状态
  assert.ok(last.graph!.nodes.length >= 2);
});
