import { test } from 'node:test';
import assert from 'node:assert/strict';
import { minimizeDfa } from '../../src/algorithms/parsing/parse-dfa-minimize/impl.ts';

test('minimize-dfa 合并等价', () => {
  const dfa = {
    states: ['A', 'B', 'C', 'D'],
    alphabet: ['0', '1'],
    delta: {
      A: { '0': 'B', '1': 'A' },
      B: { '0': 'B', '1': 'C' },
      C: { '0': 'B', '1': 'D' },
      D: { '0': 'B', '1': 'A' },
    } as Record<string, Record<string, string>>,
    start: 'A',
    accept: ['C'],
  };
  const parts = minimizeDfa(dfa);
  assert.ok(parts.find((p) => p.includes('A') && p.includes('D')));
});
