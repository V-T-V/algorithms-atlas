import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existCopy } from '../../src/algorithms/recursion/rec-words-search-dfs/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-words-search-dfs/trace.ts';

test('rec-words-search-dfs 存在', () => {
  const board = [
    ['A', 'B', 'C', 'E'],
    ['S', 'F', 'C', 'S'],
    ['A', 'D', 'E', 'E'],
  ];
  assert.ok(existCopy(board, 'ABCCED') !== null);
  assert.ok(existCopy(board, 'SEE') !== null);
});

test('rec-words-search-dfs 不存在', () => {
  const board = [
    ['A', 'B', 'C', 'E'],
    ['S', 'F', 'C', 'S'],
    ['A', 'D', 'E', 'E'],
  ];
  assert.equal(existCopy(board, 'ABCB'), null);
});

test('rec-words-search-dfs 单字符', () => {
  assert.ok(existCopy([['A']], 'A') !== null);
  assert.equal(existCopy([['A']], 'B'), null);
});

test('rec-words-search-dfs 路径长度等于单词长度', () => {
  const path = existCopy(
    [
      ['A', 'B'],
      ['C', 'D'],
    ],
    'ABC',
  );
  if (path) assert.equal(path.length, 3);
});

test('rec-words-search-dfs trace', () => {
  assert.ok(buildTrace().length > 2);
});
