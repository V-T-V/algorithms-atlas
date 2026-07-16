import { test } from 'node:test';
import assert from 'node:assert/strict';
import { numberOfMusicPlaylists } from '../../src/algorithms/dp/dp-number-of-music/impl.ts';

test('music LeetCode 920 例', () => {
  assert.equal(numberOfMusicPlaylists(3, 3, 1), 6);
  assert.equal(numberOfMusicPlaylists(2, 3, 0), 6);
  assert.equal(numberOfMusicPlaylists(2, 3, 1), 2);
});

test('music goal<n 无解', () => {
  assert.equal(numberOfMusicPlaylists(3, 2, 1), 0);
});

test('music n=1', () => {
  // 仅一首歌，k=0 时只能反复播同一首
  assert.equal(numberOfMusicPlaylists(1, 5, 0), 1);
});

test('music k=0 全排列', () => {
  // goal==n, k=0 => n!
  assert.equal(numberOfMusicPlaylists(3, 3, 0), 6); // 3!
  assert.equal(numberOfMusicPlaylists(4, 4, 0), 24); // 4!
});

test('music 钩子', () => {
  let cells = 0;
  numberOfMusicPlaylists(2, 2, 0, 1_000_000_007, { onCell: () => cells++ });
  assert.ok(cells > 0);
});
