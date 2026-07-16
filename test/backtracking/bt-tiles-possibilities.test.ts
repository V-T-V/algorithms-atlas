import { test } from 'node:test';
import assert from 'node:assert/strict';
import { btTilesPossibilities } from '../../src/algorithms/backtracking/bt-tiles-possibilities/impl.ts';

test('bt-tiles-possibilities AAB', () => {
  assert.equal(btTilesPossibilities('AAB'), 8);
});

test('bt-tiles-possibilities AAABBC', () => {
  assert.equal(btTilesPossibilities('AAABBC'), 188);
});

test('bt-tiles-possibilities 单字符', () => {
  assert.equal(btTilesPossibilities('V'), 1);
});

test('bt-tiles-possibilities 全相同', () => {
  assert.equal(btTilesPossibilities('AAA'), 3);
});
