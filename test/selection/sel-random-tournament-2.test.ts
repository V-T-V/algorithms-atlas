import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomTournamentSelect } from '../../src/algorithms/selection/sel-random-tournament-2/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-random-tournament-2/trace.ts';

test('random tournament select 第 k 小', () => {
  const a = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  for (let k = 0; k < 10; k++) assert.equal(randomTournamentSelect(a, k, 11), k);
});
test('random tournament select trace 非空', () => assert.ok(buildTrace().length > 0));
