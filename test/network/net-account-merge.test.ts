import { test } from 'node:test';
import assert from 'node:assert/strict';
import { accountsMerge } from '../../src/algorithms/network/net-account-merge/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-account-merge/trace.ts';
test('accountsMerge 正确', () => {
  const r = accountsMerge([
    { name: 'John', emails: ['john@mail.com', 'john2@mail.com'] },
    { name: 'John', emails: ['john3@mail.com', 'john@mail.com'] },
    { name: 'Mary', emails: ['mary@mail.com'] },
  ]);
  assert.equal(r.length, 2);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
