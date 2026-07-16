import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Bff } from '../../src/algorithms/design/design-bff/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-bff/trace.ts';

test('bff web 视图聚合', async () => {
  const bff = new Bff(async (svc) => {
    if (svc === 'user') return { id: '1', name: 'alice' };
    if (svc === 'orders') return [{ id: 'o1' }, { id: 'o2' }];
    return [{ p: 1 }, { p: 2 }, { p: 3 }, { p: 4 }];
  });
  const v = await bff.webView('1');
  assert.deepEqual(v.user, { id: '1', name: 'alice' });
  assert.equal(v.orderCount, 2);
  assert.equal((v.topRecs as unknown[]).length, 3);
});
test('bff mobile 视图更精简', async () => {
  const bff = new Bff(async () => ({ name: 'bob' }));
  const v = await bff.mobileView('1');
  assert.equal(v.name, 'bob');
  assert.equal(v.hasData, true);
});
test('bff trace 非空', () => assert.ok(buildTrace().length > 0));
