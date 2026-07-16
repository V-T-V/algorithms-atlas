import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  stringMatchAutomaton,
  buildMatchAutomaton,
} from '../../src/algorithms/string/string-match-automaton/impl.ts';

test('stringMatchAutomaton 基本匹配', () => {
  assert.deepEqual(stringMatchAutomaton('AABAACAADAABAABA', 'AABA'), [0, 9, 12]);
  assert.deepEqual(stringMatchAutomaton('ABCDEF', 'CD'), [2]);
  assert.deepEqual(stringMatchAutomaton('HELLO', 'XYZ'), []);
  assert.deepEqual(stringMatchAutomaton('AAAAA', 'AA'), [0, 1, 2, 3]);
});

test('stringMatchAutomaton 边界', () => {
  assert.deepEqual(stringMatchAutomaton('', 'A'), []);
  assert.deepEqual(stringMatchAutomaton('A', 'A'), [0]);
  assert.deepEqual(stringMatchAutomaton('ABC', ''), []);
});

test('buildMatchAutomaton 转移表', () => {
  const trans = buildMatchAutomaton('AB', 'AB');
  // 状态 0：A->1, B->0
  assert.equal(trans[0]!['A'], 1);
  assert.equal(trans[0]!['B'], 0);
  // 状态 1：A->1(回到匹配 A), B->2(完整)
  assert.equal(trans[1]!['A'], 1);
  assert.equal(trans[1]!['B'], 2);
});

test('stringMatchAutomaton 钩子', () => {
  let transfers = 0;
  let founds = 0;
  stringMatchAutomaton('AABAA', 'AAB', {
    onTransfer: () => transfers++,
    onFound: () => founds++,
  });
  assert.ok(transfers > 0);
  assert.equal(founds, 1);
});
