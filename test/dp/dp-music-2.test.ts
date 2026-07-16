import { test } from 'node:test';
import assert from 'node:assert/strict';
import { playlistCount } from '../../src/algorithms/dp/dp-music-2/impl.ts';

test('music [1,2,3,4] target=5', () => {
  // subsets summing to 5: {1,4},{2,3},{1,?},...=3
  assert.equal(playlistCount([1, 2, 3, 4], 5), 3);
});

test('music 单歌正好', () => {
  assert.equal(playlistCount([5], 5), 1);
});

test('music 无解', () => {
  assert.equal(playlistCount([2, 4], 3), 0);
});

test('music target=0', () => {
  assert.equal(playlistCount([1, 2, 3], 0), 1);
});
