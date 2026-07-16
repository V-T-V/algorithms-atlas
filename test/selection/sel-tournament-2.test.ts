import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tournamentSelect } from '../../src/algorithms/selection/sel-tournament-2/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-tournament-2/trace.ts';

test('tournament select 第 k 小', () => {
  const a = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  for (let k = 0; k < 10; k++) assert.equal(tournamentSelect(a, k), k);
});
test('tournament select trace 非空', () => assert.ok(buildTrace().length > 0));
