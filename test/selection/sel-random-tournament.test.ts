import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  randomTournament,
  makeRng,
} from '../../src/algorithms/selection/sel-random-tournament/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-random-tournament/trace.ts';

test('sel-random-tournament 冠军是最大值', () => {
  const r = randomTournament([3, 7, 2, 9, 5, 1, 8, 4], makeRng(1));
  assert.equal(r.champion, 9);
});

test('sel-random-tournament 单元素直接冠军', () => {
  const r = randomTournament([42], makeRng(1));
  assert.equal(r.champion, 42);
  assert.equal(r.rounds.length, 0);
});

test('sel-random-tournament 轮数 = ceil(log2(n))', () => {
  const r = randomTournament([1, 2, 3, 4, 5, 6, 7, 8], makeRng(2));
  assert.equal(r.rounds.length, 3); // log2(8)=3
});

test('sel-random-tournament 空抛错', () => {
  assert.throws(() => randomTournament([], makeRng(1)));
});

test('sel-random-tournament trace', () => {
  assert.ok(buildTrace().length >= 2);
});
