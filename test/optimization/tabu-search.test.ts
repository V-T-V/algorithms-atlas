import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  adjacentEnergy,
  mulberry32,
  swapNeighborhood,
  tabuSearch,
} from '../../src/algorithms/optimization/tabu-search/impl.ts';

test('tabu-search 改善排列相邻差平方和', () => {
  const initial = [4, 1, 9, 2, 7];
  const result = tabuSearch(initial, swapNeighborhood, adjacentEnergy, {
    maxIterations: 40,
    tabuTenure: 5,
    rng: mulberry32(3),
  });
  assert.ok(result.bestEnergy <= adjacentEnergy(initial));
  assert.deepEqual(
    [...result.best].sort((a, b) => a - b),
    [...initial].sort((a, b) => a - b),
  );
});

test('tabu-search 空邻域提前结束', () => {
  const result = tabuSearch([1], () => [], adjacentEnergy, {
    maxIterations: 10,
    tabuTenure: 2,
    rng: mulberry32(1),
  });
  assert.deepEqual(result.best, [1]);
  assert.equal(result.iterations, 0);
});
