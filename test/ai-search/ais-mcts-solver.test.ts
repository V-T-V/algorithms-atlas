import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  mctsSolver,
  type SolverDomain,
} from '../../src/algorithms/ai-search/ais-mcts-solver/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-mcts-solver/trace.ts';

test('ais-mcts-solver 必胜局面证明为 win', () => {
  const domain: SolverDomain<number> = {
    legalActions: (s) => (s < 3 ? [0] : []),
    apply: (s) => s + 1,
    terminalValue: (s) => (s >= 3 ? 1 : null),
  };
  const { proof } = mctsSolver(0, domain, 50);
  assert.equal(proof, 'win');
});

test('ais-mcts-solver 必败局面证明为 loss', () => {
  const domain: SolverDomain<number> = {
    legalActions: (s) => (s < 2 ? [0] : []),
    apply: (s) => s + 1,
    terminalValue: (s) => (s >= 2 ? -1 : null), // 到达者输
  };
  const { proof } = mctsSolver(0, domain, 50);
  assert.equal(proof, 'loss');
});

test('ais-mcts-solver 无终局保持 unknown', () => {
  const domain: SolverDomain<number> = {
    legalActions: () => [0],
    apply: (s) => s, // 不变
    terminalValue: () => null,
  };
  const { proof } = mctsSolver(0, domain, 5);
  assert.equal(proof, 'unknown');
});

test('ais-mcts-solver trace', () => {
  assert.ok(buildTrace().length > 2);
});
