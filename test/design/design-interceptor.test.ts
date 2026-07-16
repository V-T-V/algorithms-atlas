import { test } from 'node:test';
import assert from 'node:assert/strict';
import { withInterceptors } from '../../src/algorithms/design/design-interceptor/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-interceptor/trace.ts';

test('interceptor 前后处理', () => {
  let log = '';
  const w = withInterceptors(
    (x: number) => x + 1,
    [
      {
        pre: (x) => {
          log += `pre${x};`;
        },
        post: (r) => {
          log += `post${r};`;
          return r * 10;
        },
      },
    ],
  );
  const r = w(5);
  assert.equal(r, 60); // (5+1)*10
  assert.equal(log, 'pre5;post6;');
});
test('interceptor skip 短路', () => {
  const w = withInterceptors(
    (x: number) => x + 1,
    [{ pre: () => ({ skip: true, result: 999 as number }) }],
  );
  assert.equal(w(5), 999);
});
test('interceptor trace 非空', () => assert.ok(buildTrace().length > 0));
