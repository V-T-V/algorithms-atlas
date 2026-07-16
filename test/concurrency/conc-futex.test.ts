import { test } from 'node:test';
import assert from 'node:assert/strict';
import { futexLock } from '../../src/algorithms/concurrency/conc-futex/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-futex/trace.ts';
test('futex 首个获取者成为 owner', () => {
  const r = futexLock(
    [1, 2],
    [
      { tid: 1, fast: true },
      { tid: 2, fast: true },
    ],
  );
  assert.ok(r.owner !== null);
});
test('futex trace 非空', () => assert.ok(buildTrace().length >= 2));
