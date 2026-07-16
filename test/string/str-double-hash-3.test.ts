import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DoubleHash3 } from '../../src/algorithms/string/str-double-hash-3/impl.ts';

test('double hash 相同子串一致', () => {
  const h = new DoubleHash3('abababab');
  const a = h.hash(0, 1);
  const b = h.hash(2, 3);
  assert.deepEqual(a, b);
});

test('double hash 不同子串不一致', () => {
  const h = new DoubleHash3('abcdef');
  const a = h.hash(0, 2);
  const b = h.hash(3, 5);
  assert.notDeepEqual(a, b);
});
