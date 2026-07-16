import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countVowelPermutation } from '../../src/algorithms/dp/dp-vowels-2/impl.ts';

test('vowels LC1220 n=1', () => {
  assert.equal(countVowelPermutation(1), 5);
});

test('vowels LC1220 n=2', () => {
  assert.equal(countVowelPermutation(2), 10);
});

test('vowels LC1220 n=5', () => {
  assert.equal(countVowelPermutation(5), 68);
});
