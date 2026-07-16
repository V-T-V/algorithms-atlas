import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Reactor } from '../../src/algorithms/design/design-reactor/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-reactor/trace.ts';
test('reactor 分发', () => {
  const r = new Reactor();
  const log: string[] = [];
  r.register(1, (_fd, d) => log.push(d));
  r.fire([{ fd: 1, data: 'x' }]);
  assert.deepEqual(log, ['x']);
});
test('reactor trace 非空', () => assert.ok(buildTrace().length > 0));
