import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TssCounter } from '../../src/algorithms/design/design-thread-specific-storage/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-thread-specific-storage/trace.ts';
test('tss 各自独立', () => {
  const c = new TssCounter();
  c.inc(1);
  c.inc(1);
  c.inc(2);
  assert.equal(c.get(1), 2);
  assert.equal(c.get(2), 1);
  assert.equal(c.get(99), 0);
});
test('tss trace 非空', () => assert.ok(buildTrace().length > 0));
