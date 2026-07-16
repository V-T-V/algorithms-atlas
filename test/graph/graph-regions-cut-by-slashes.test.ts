import { test } from 'node:test';
import assert from 'node:assert/strict';
import { regionsBySlashes } from '../../src/algorithms/graph/graph-regions-cut-by-slashes/impl.ts';

test('regions-cut LeetCode 959 例 1', () => {
  assert.equal(regionsBySlashes([' /', '/ ']), 2);
});

test('regions-cut LeetCode 959 例 2', () => {
  assert.equal(regionsBySlashes([' /', '  ']), 1);
});

test('regions-cut LeetCode 959 例 3', () => {
  assert.equal(regionsBySlashes(['/\\', '\/']), 5);
});

test('regions-cut 单格空', () => {
  assert.equal(regionsBySlashes([' ']), 1);
});

test('regions-cut 单格斜杠', () => {
  assert.equal(regionsBySlashes(['/']), 2);
});
