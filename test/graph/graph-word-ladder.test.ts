import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ladderLength } from '../../src/algorithms/graph/graph-word-ladder/impl.ts';

test('word-ladder LeetCode 127 例 1', () => {
  assert.equal(ladderLength('hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log', 'cog']), 5);
});

test('word-ladder LeetCode 127 例 2', () => {
  assert.equal(ladderLength('hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log']), 0);
});

test('word-ladder 一步可达', () => {
  assert.equal(ladderLength('a', 'c', ['a', 'b', 'c']), 2);
});

test('word-ladder begin 即在词典', () => {
  assert.equal(ladderLength('hot', 'dot', ['hot', 'dot', 'lot']), 2);
});

test('word-ladder 无路径', () => {
  assert.equal(ladderLength('abc', 'xyz', ['abd', 'xyd']), 0);
});
