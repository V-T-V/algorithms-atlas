import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BoundedMonitor } from '../../src/algorithms/design/design-monitor-object/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-monitor-object/trace.ts';
test('monitor put/get', () => {
  const m = new BoundedMonitor(3);
  m.put(1);
  m.put(2);
  assert.equal(m.get(), 1);
  assert.equal(m.size(), 1);
});
test('monitor trace 非空', () => assert.ok(buildTrace().length > 0));
