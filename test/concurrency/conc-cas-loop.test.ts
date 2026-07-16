import { test } from 'node:test';
import assert from 'node:assert/strict';
import { casLoop } from '../../src/algorithms/concurrency/conc-cas-loop/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-cas-loop/trace.ts';
test('cas 最终成功', () => {
  const r = casLoop(0, (c) => c + 1, [2, 4]);
  assert.ok(r.attempts >= 1);
  assert.equal(r.val, 1);
});
test('cas trace 非空', () => assert.ok(buildTrace().length >= 2));
