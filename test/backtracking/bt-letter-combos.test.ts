import { test } from 'node:test';
import assert from 'node:assert/strict';
import { letterCombinations } from '../../src/algorithms/backtracking/bt-letter-combos/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-letter-combos/trace.ts';
test('letterCombinations 正确', () => {
  assert.deepEqual(letterCombinations('23'), [
    'ad',
    'ae',
    'af',
    'bd',
    'be',
    'bf',
    'cd',
    'ce',
    'cf',
  ]);
  assert.deepEqual(letterCombinations(''), []);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
