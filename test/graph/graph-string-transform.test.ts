import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ladderLengthBi } from '../../src/algorithms/graph/graph-string-transform/impl.ts';

test('string-transform LeetCode 127 例 1', () => {
  assert.equal(ladderLengthBi('hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log', 'cog']), 5);
});

test('string-transform LeetCode 127 例 2', () => {
  assert.equal(ladderLengthBi('hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log']), 0);
});

test('string-transform 相邻一步', () => {
  assert.equal(ladderLengthBi('a', 'c', ['a', 'b', 'c']), 2);
});

test('string-transform 无路径', () => {
  assert.equal(ladderLengthBi('abc', 'xyz', ['abd', 'xyd']), 0);
});

test('string-transform begin=end（含）', () => {
  // begin 不在 dict，但 begin=end 不会触发；这里测 end 不在 dict
  assert.equal(ladderLengthBi('hot', 'xyz', ['hot', 'dot']), 0);
});
