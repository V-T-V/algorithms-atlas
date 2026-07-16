import { test } from 'node:test';
import assert from 'node:assert/strict';
import { retry } from '../../src/algorithms/design/design-retry/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-retry/trace.ts';

test('retry 最终成功', async () => {
  let n = 0;
  const r = await retry(
    async () => {
      n++;
      if (n < 3) throw new Error('x');
      return 'ok';
    },
    { maxAttempts: 5, baseDelayMs: 1, maxDelayMs: 5, jitter: 0 },
    {},
    async () => {},
  );
  assert.equal(r, 'ok');
  assert.equal(n, 3);
});
test('retry 达上限抛最后错', async () => {
  await assert.rejects(
    () =>
      retry(
        async () => {
          throw new Error('always');
        },
        { maxAttempts: 2, baseDelayMs: 1, maxDelayMs: 2, jitter: 0 },
        {},
        async () => {},
      ),
    /always/,
  );
});
test('retry 退避指数增长', async () => {
  const delays: number[] = [];
  try {
    await retry(
      async () => {
        throw new Error('x');
      },
      { maxAttempts: 4, baseDelayMs: 10, maxDelayMs: 1000, jitter: 0 },
      { onBackoff: (_a, d) => delays.push(d) },
      async () => {},
    );
  } catch {
    /* expected to exhaust */
  }
  assert.deepEqual(delays, [10, 20, 40]);
});
test('retry trace 非空', () => assert.ok(buildTrace().length > 0));
