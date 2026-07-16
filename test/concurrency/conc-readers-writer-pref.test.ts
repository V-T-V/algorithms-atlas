import { test } from 'node:test';
import assert from 'node:assert/strict';
import { writerPrefRwLock } from '../../src/algorithms/concurrency/conc-readers-writer-pref/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-readers-writer-pref/trace.ts';
test('wp 释放后归零', () => {
  const s = writerPrefRwLock([{ op: 'r' }, { op: 'w' }]);
  assert.equal(s.waitingW, 0);
});
test('wp trace 非空', () => assert.ok(buildTrace().length >= 2));
