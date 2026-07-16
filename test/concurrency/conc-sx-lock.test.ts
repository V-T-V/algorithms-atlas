import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sxLock } from '../../src/algorithms/concurrency/conc-sx-lock/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-sx-lock/trace.ts';
test('sx 释放后状态归零', () => {
  const s = sxLock([{ op: 'r' }, { op: 'w' }]);
  assert.equal(s.readers, 0);
  assert.equal(s.writer, false);
});
test('sx trace 非空', () => assert.ok(buildTrace().length >= 2));
