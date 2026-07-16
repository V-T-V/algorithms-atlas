import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wordLadder2 } from '../../src/algorithms/graph/graph-word-ladder-2/impl.ts';

test('word-ladder-2 LeetCode 126 例', () => {
  const paths = wordLadder2('hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log', 'cog']);
  assert.equal(paths.length, 2);
  // 每条路径长度 = 5（hit-hot-dot-dog-cog / hit-hot-lot-log-cog）
  for (const p of paths) assert.equal(p.length, 5);
});

test('word-ladder-2 endWord 不在字典', () => {
  const paths = wordLadder2('hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log']);
  assert.equal(paths.length, 0);
});

test('word-ladder-2 无路径', () => {
  const paths = wordLadder2('hit', 'xyz', ['hot', 'dot']);
  assert.equal(paths.length, 0);
});

test('word-ladder-2 相邻', () => {
  const paths = wordLadder2('hit', 'hot', ['hot']);
  assert.deepEqual(paths, [['hit', 'hot']]);
});
