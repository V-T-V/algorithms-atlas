import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Monostate } from '../../src/algorithms/design/design-monostate/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-monostate/trace.ts';
test('monostate 共享状态', () => {
  const a = new Monostate(1);
  const b = new Monostate(2);
  a.set(42);
  assert.equal(b.get(), 42);
});
test('monostate trace 非空', () => assert.ok(buildTrace().length > 0));
