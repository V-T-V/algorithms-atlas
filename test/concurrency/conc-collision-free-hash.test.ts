import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stripedHashTable } from '../../src/algorithms/concurrency/conc-collision-free-hash/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-collision-free-hash/trace.ts';
test('striped put/get', () => {
  const t = stripedHashTable(
    [
      { op: 'put', key: 1, val: 9 },
      { op: 'get', key: 1 },
    ],
    4,
  );
  assert.equal(t.get(1), 9);
});
test('striped trace 非空', () => assert.ok(buildTrace().length >= 2));
