import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Broker } from '../../src/algorithms/design/design-broker/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-broker/trace.ts';
test('broker 调用', () => {
  const b = new Broker();
  b.register('echo', (r) => r);
  assert.equal(b.call('echo', 'x'), 'x');
  assert.equal(b.call('nope', ''), 'unknown');
});
test('broker trace 非空', () => assert.ok(buildTrace().length > 0));
