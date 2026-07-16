import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countVowelStrings } from '../../src/algorithms/dp/dp-vowel-3/impl.ts';

test('vowel n=1', () => {
  assert.equal(countVowelStrings(1), 5);
});
test('vowel n=2', () => {
  assert.equal(countVowelStrings(2), 15);
});
test('vowel n=5', () => {
  assert.equal(countVowelStrings(5), 126);
});
