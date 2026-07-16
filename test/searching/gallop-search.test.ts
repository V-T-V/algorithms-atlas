import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gallopSearch } from '../../src/algorithms/searching/gallop-search/impl.ts';

test('gallopSearch 命中与未命中', () => {
  const a = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21];
  assert.equal(gallopSearch(a, 7), 3);
  assert.equal(gallopSearch(a, 1), 0);
  assert.equal(gallopSearch(a, 21), 10);
  assert.equal(gallopSearch(a, 6), -1);
  assert.equal(gallopSearch(a, 0), -1);
  assert.equal(gallopSearch(a, 99), -1);
});

test('gallopSearch 边界', () => {
  assert.equal(gallopSearch([], 1), -1);
  assert.equal(gallopSearch([5], 5), 0);
  assert.equal(gallopSearch([5], 3), -1);
});

test('gallopSearch 钩子', () => {
  let jumps = 0;
  let probes = 0;
  let done = -1;
  gallopSearch([1, 3, 5, 7, 9, 11, 13, 15, 17], 13, {
    onJump: () => jumps++,
    onProbe: () => probes++,
    onDone: (i) => (done = i),
  });
  assert.ok(jumps >= 0);
  assert.ok(probes > 0);
  assert.equal(done, 6);
});
