import { test } from 'node:test';
import assert from 'node:assert/strict';
import { eliminateLeftRecursion } from '../../src/algorithms/parsing/parse-left-recursion/impl.ts';

test('eliminate-left-recursion 典型文法', () => {
  const r = eliminateLeftRecursion({ head: 'E', alts: [['E', '+', 'T'], ['T']] });
  assert.equal(r.changed, true);
  assert.equal(r.rules.length, 2);
  assert.deepEqual(r.rules[1]!.alts, [['+', 'T', "E'"], []]);
});
test('eliminate-left-recursion 无左递归不变', () => {
  const r = eliminateLeftRecursion({ head: 'S', alts: [['a'], ['b', 'S']] });
  assert.equal(r.changed, false);
});
