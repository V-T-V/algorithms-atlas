import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HealthChecker } from '../../src/algorithms/design/design-health-check/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-health-check/trace.ts';

test('health 全 UP', async () => {
  const hc = new HealthChecker([{ name: 'a', check: async () => ({ ok: true }) }]);
  const r = await hc.check();
  assert.equal(r.overall, 'UP');
});
test('health 部分 DOWN = DEGRADED', async () => {
  const hc = new HealthChecker([
    { name: 'a', check: async () => ({ ok: true }) },
    { name: 'b', check: async () => ({ ok: false }) },
  ]);
  const r = await hc.check();
  assert.equal(r.overall, 'DEGRADED');
});
test('health 全 DOWN = DOWN', async () => {
  const hc = new HealthChecker([
    {
      name: 'a',
      check: async () => {
        throw new Error('x');
      },
    },
  ]);
  const r = await hc.check();
  assert.equal(r.overall, 'DOWN');
});
test('health trace 非空', () => assert.ok(buildTrace().length > 0));
