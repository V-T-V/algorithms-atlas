import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  tournamentSelect,
  tournamentSelectMany,
  makeRng,
} from '../../src/algorithms/selection/sel-tournament/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-tournament/trace.ts';

test('sel-tournament 胜者最优', () => {
  const idx = tournamentSelect([3, 7, 2, 9, 5], 3, makeRng(1));
  // 抽到的 3 个中最大者
  assert.ok(idx === 1 || idx === 3); // fit 7 或 9
});

test('sel-tournament k=1 返回随机一个', () => {
  const idx = tournamentSelect([1, 2, 3, 4], 1, makeRng(2));
  assert.ok(idx >= 0 && idx < 4);
});

test('sel-tournament k>n 抛错', () => {
  assert.throws(() => tournamentSelect([1, 2], 5, makeRng(1)));
});

test('sel-tournament many 返回 count 个', () => {
  const ws = tournamentSelectMany([1, 2, 3, 4, 5], 2, 10, makeRng(3));
  assert.equal(ws.length, 10);
});

test('sel-tournament trace', () => {
  assert.ok(buildTrace().length > 2);
});
