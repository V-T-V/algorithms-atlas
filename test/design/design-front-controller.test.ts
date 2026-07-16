import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FrontController } from '../../src/algorithms/design/design-front-controller/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-front-controller/trace.ts';
test('fc 分发命中', () => {
  const fc = new FrontController();
  fc.register('a', () => 'A');
  assert.equal(fc.dispatch('a', ''), 'A');
  assert.equal(fc.dispatch('z', ''), '404');
});
test('fc trace 非空', () => assert.ok(buildTrace().length > 0));
