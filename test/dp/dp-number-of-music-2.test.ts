import { test } from 'node:test';
import assert from 'node:assert/strict';
import { musicPlaylist } from '../../src/algorithms/dp/dp-number-of-music-2/impl.ts';

test('music LeetCode 920 例 1', () => {
  // n=3, goal=3, k=1 => 6
  assert.equal(musicPlaylist(3, 3, 1), 6);
});

test('music LeetCode 920 例 2', () => {
  // n=2, goal=3, k=0 => 6
  assert.equal(musicPlaylist(2, 3, 0), 6);
});

test('music LeetCode 920 例 3', () => {
  // n=2, goal=3, k=1 => 2
  assert.equal(musicPlaylist(2, 3, 1), 2);
});

test('music goal==n 无重复约束', () => {
  // n=goal, k 任意；相当于全排列 n!
  assert.equal(musicPlaylist(3, 3, 3), 6);
});

test('music 单首歌', () => {
  assert.equal(musicPlaylist(1, 1, 1), 1);
});
