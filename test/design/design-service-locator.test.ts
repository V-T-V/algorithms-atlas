import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ServiceLocator } from '../../src/algorithms/design/design-service-locator/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-service-locator/trace.ts';

test('locator 首次创建后缓存', () => {
  let calls = 0;
  const loc = new ServiceLocator();
  loc.register('svc', () => {
    calls++;
    return { id: 1 };
  });
  const a = loc.resolve('svc');
  const b = loc.resolve('svc');
  assert.equal(calls, 1);
  assert.equal(a, b);
});
test('locator 未注册抛错', () => {
  const loc = new ServiceLocator();
  assert.throws(() => loc.resolve('nope'));
});
test('locator trace 非空', () => assert.ok(buildTrace().length > 0));
