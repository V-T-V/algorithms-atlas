import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  gallopSearch3,
  type Gallop3Hooks,
} from '../../src/algorithms/searching/search-gallop-3/impl.ts';

const ARR = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21];

test('search-gallop-3 命中', () => {
  assert.equal(gallopSearch3(ARR, 1), 0);
  assert.equal(gallopSearch3(ARR, 21), 10);
  assert.equal(gallopSearch3(ARR, 15), 7);
  assert.equal(gallopSearch3(ARR, 11), 5);
});
test('search-gallop-3 未命中', () => {
  assert.equal(gallopSearch3(ARR, 0), -1);
  assert.equal(gallopSearch3(ARR, 22), -1);
  assert.equal(gallopSearch3(ARR, 8), -1);
});
test('search-gallop-3 边界', () => {
  assert.equal(gallopSearch3([], 1), -1);
  assert.equal(gallopSearch3([5], 5), 0);
  assert.equal(gallopSearch3([5], 3), -1);
});
test('search-gallop-3 钩子', () => {
  let c = 0;
  gallopSearch3(ARR, 15, { onGallop: () => c++ } as Gallop3Hooks);
  assert.ok(c >= 1);
});
