import { test } from 'node:test';
import assert from 'node:assert/strict';
import { zFunction, zMatch } from '../../src/algorithms/string/str-z-3/impl.ts';

test('z function 基础', () => {
  assert.deepEqual(zFunction('aaaaa'), [5, 4, 3, 2, 1]);
  assert.deepEqual(zFunction('abababab'), [8, 0, 6, 0, 4, 0, 2, 0]);
});

test('z match', () => {
  assert.deepEqual(zMatch('ABABABAB', 'ABA'), [0, 2, 4]);
});
