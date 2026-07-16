import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CircuitBreaker } from '../../src/algorithms/design/design-circuit-breaker/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-circuit-breaker/trace.ts';

test('cb 失败达阈值 OPEN', async () => {
  const t = 0;
  const cb = new CircuitBreaker(
    { failureThreshold: 2, resetTimeoutMs: 100, halfOpenMax: 1 },
    () => t,
  );
  await assert.rejects(() =>
    cb.call(async () => {
      throw new Error('x');
    }),
  );
  await assert.rejects(() =>
    cb.call(async () => {
      throw new Error('x');
    }),
  );
  assert.equal(cb.state, 'OPEN');
  await assert.rejects(() => cb.call(async () => 1), /circuit open/);
});
test('cb 超时后 HALF_OPEN 恢复', async () => {
  let t = 0;
  const cb = new CircuitBreaker(
    { failureThreshold: 1, resetTimeoutMs: 100, halfOpenMax: 1 },
    () => t,
  );
  await assert.rejects(() =>
    cb.call(async () => {
      throw new Error('x');
    }),
  );
  assert.equal(cb.state, 'OPEN');
  t += 200;
  const r = await cb.call(async () => 'recovered');
  assert.equal(r, 'recovered');
  assert.equal(cb.state, 'CLOSED');
});
test('cb trace 非空', () => assert.ok(buildTrace().length > 0));
