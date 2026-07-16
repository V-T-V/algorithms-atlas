import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  minimizeDFA,
  type DFA,
  type MinimizeHooks,
} from '../../src/algorithms/parsing/parse-regex-minimize/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/parsing/parse-regex-minimize/trace.ts';

// 演示 DFA：A、C、D 行为等价（在 a→B，b→C/D/C），B 与之不同。
// 接受 {D}。预期：{A,C,D} 合并 + {B}，最小 2 状态。
const DEMO: DFA = DEFAULT_INPUT;

test('parse-regex-minimize 减少状态数', () => {
  const r = minimizeDFA(DEMO);
  assert.ok(r.dfa.states.length < DEMO.states.length, `从 ${DEMO.states.length} 减少`);
});

test('parse-regex-minimize 起始状态保留', () => {
  const r = minimizeDFA(DEMO);
  assert.ok(r.dfa.states.includes(r.dfa.start));
});

test('parse-regex-minimize 接受状态保留', () => {
  const r = minimizeDFA(DEMO);
  assert.ok(r.dfa.accept.length >= 1);
});

test('parse-regex-minimize A,C,D 等价合并', () => {
  const r = minimizeDFA(DEMO);
  // A、C、D 应映射到同一代表
  assert.equal(r.mapping['A'], r.mapping['C']);
  assert.equal(r.mapping['C'], r.mapping['D']);
  // B 单独一组
  assert.notEqual(r.mapping['A'], r.mapping['B']);
});

test('parse-regex-minimize 最小 DFA 转移自洽', () => {
  const r = minimizeDFA(DEMO);
  for (const s of r.dfa.states) {
    for (const sym of r.dfa.alphabet) {
      const tgt = r.dfa.transitions[s]?.[sym];
      assert.ok(tgt !== undefined, `状态 ${s} 在 ${sym} 上无转移`);
      assert.ok(r.dfa.states.includes(tgt));
    }
  }
});

test('parse-regex-minimize 已最小 DFA 不变', () => {
  const min: DFA = {
    states: ['A', 'B'],
    alphabet: ['a'],
    transitions: { A: { a: 'B' }, B: { a: 'B' } },
    start: 'A',
    accept: ['B'],
  };
  const r = minimizeDFA(min);
  assert.equal(r.dfa.states.length, 2);
});

test('parse-regex-minimize 全接受状态归一', () => {
  const all: DFA = {
    states: ['A', 'B', 'C'],
    alphabet: ['a'],
    transitions: { A: { a: 'A' }, B: { a: 'B' }, C: { a: 'C' } },
    start: 'A',
    accept: ['A', 'B', 'C'],
  };
  const r = minimizeDFA(all);
  assert.equal(r.dfa.states.length, 1);
});

test('parse-regex-minimize partitions 记录历史', () => {
  const r = minimizeDFA(DEMO);
  assert.ok(r.partitions.length >= 1);
  assert.ok(r.iterations >= 1);
});

test('parse-regex-minimize 钩子触发', () => {
  let parts = 0;
  let results = 0;
  const hooks: MinimizeHooks = {
    onPartition: () => parts++,
    onResult: () => results++,
  };
  minimizeDFA(DEMO, hooks);
  assert.ok(parts >= 2);
  assert.equal(results, 1);
});

test('buildTrace 生成 aux 帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
  for (const f of frames) assert.ok(f.aux);
  const last = frames[frames.length - 1]!;
  const cur = last.aux!.find((e) => e.label === '现状态数');
  assert.ok(cur);
  assert.ok(Number(cur!.value) <= DEMO.states.length);
});
