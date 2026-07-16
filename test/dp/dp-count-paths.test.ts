import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countPaths } from '../../src/algorithms/dp/dp-count-paths/impl.ts';

const binom = (n: number, k: number): number => {
  let r = 1;
  for (let i = 0; i < k; i++) r = (r * (n - i)) / (i + 1);
  return r;
};

test('count-paths 等于组合数', () => {
  for (const [m, n] of [
    [1, 1],
    [2, 2],
    [3, 3],
    [4, 4],
    [3, 7],
  ]) {
    assert.equal(countPaths(m!, n!), binom(m! + n! - 2, m! - 1), `${m}x${n}`);
  }
});

test('count-paths 单格', () => {
  assert.equal(countPaths(1, 1), 1);
});

test('count-paths 单行/单列', () => {
  assert.equal(countPaths(1, 5), 1);
  assert.equal(countPaths(5, 1), 1);
});

test('count-paths 零维', () => {
  assert.equal(countPaths(0, 3), 0);
  assert.equal(countPaths(3, 0), 0);
});

test('count-paths 钩子', () => {
  let cells = 0;
  countPaths(2, 3, { onCell: () => cells++ });
  assert.equal(cells, 6);
});
