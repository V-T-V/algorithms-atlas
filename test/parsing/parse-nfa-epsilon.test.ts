import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  nfaRun,
  epsilonClosure,
  type EpsilonNfa,
} from '../../src/algorithms/parsing/parse-nfa-epsilon/impl.ts';

const nfa: EpsilonNfa = {
  states: ['q0', 'q1', 'q2'],
  alphabet: ['a', 'b'],
  edges: [
    { from: 'q0', input: null, to: 'q1' },
    { from: 'q0', input: 'a', to: 'q0' },
    { from: 'q1', input: 'b', to: 'q2' },
  ],
  start: 'q0',
  accept: ['q2'],
};
test('epsilon-nfa 闭包', () => {
  const c = epsilonClosure(nfa, new Set(['q0']));
  assert.ok(c.has('q0') && c.has('q1'));
});
test('epsilon-nfa 接受', () => {
  assert.equal(nfaRun(nfa, ['a', 'a', 'b']), true);
  assert.equal(nfaRun(nfa, ['b']), true);
});
test('epsilon-nfa 拒绝', () => {
  assert.equal(nfaRun(nfa, ['a', 'a']), false);
});
