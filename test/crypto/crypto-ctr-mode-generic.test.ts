import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ctrEncrypt } from '../../src/algorithms/crypto/crypto-ctr-mode-generic/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-ctr-mode-generic/trace.ts';
const E = (b: number[]) => b.map((x) => x + 1);
test('ctr 自反', () => {
  const ct = ctrEncrypt([[5, 5]], [0, 0], E);
  const ks = E([0, 0]);
  assert.deepEqual(ct[0], [5 ^ ks[0]!, 5 ^ ks[1]!]);
});
test('ctr trace 非空', () => assert.ok(buildTrace().length > 0));
