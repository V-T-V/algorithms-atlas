import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TokenBucket } from '../../src/algorithms/design/design-rate-limiter/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-rate-limiter/trace.ts';

test('rate limiter 容量内放行', () => {
  const t = 0;
  const tb = new TokenBucket(3, 1, () => t);
  assert.equal(tb.tryAcquire(), true);
  assert.equal(tb.tryAcquire(), true);
  assert.equal(tb.tryAcquire(), true);
  assert.equal(tb.tryAcquire(), false);
});
test('rate limiter 补充后恢复', () => {
  let t = 0;
  const tb = new TokenBucket(1, 1, () => t);
  assert.equal(tb.tryAcquire(), true);
  assert.equal(tb.tryAcquire(), false);
  t += 1000;
  assert.equal(tb.tryAcquire(), true);
});
test('rate limiter trace 非空', () => assert.ok(buildTrace().length > 0));
