import { test } from 'node:test';
import assert from 'node:assert/strict';
import { optimisticLock } from '../../src/algorithms/concurrency/conc-optlock/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-optlock/trace.ts';
test('opt 版本一致提交成功', () => {
  const r = optimisticLock(5, 5, (v) => v + 1);
  assert.equal(r.ok, true);
  assert.equal(r.ver, 6);
});
test('opt trace 非空', () => assert.ok(buildTrace().length >= 2));
