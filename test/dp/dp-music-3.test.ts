import { test } from 'node:test';
import assert from 'node:assert/strict';
import { numMusicPlaylists } from '../../src/algorithms/dp/dp-music-3/impl.ts';

test('music n=3 goal=3 k=1', () => {
  assert.equal(numMusicPlaylists(3, 3, 1), 12);
});
test('music n=2 goal=2 k=0', () => {
  assert.equal(numMusicPlaylists(2, 2, 0), 4);
});
