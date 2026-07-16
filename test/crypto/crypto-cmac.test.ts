import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cmacCompute } from '../../src/algorithms/crypto/crypto-cmac/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-cmac/trace.ts';
const E = (b: number[]) => b.map((x) => x + 1);
test('cmac 确定性', () => {
  const t1 = cmacCompute([[1, 2]], E, [0, 0], [0, 0]);
  const t2 = cmacCompute([[1, 2]], E, [0, 0], [0, 0]);
  assert.deepEqual(t1, t2);
});
test('cmac trace 非空', () => assert.ok(buildTrace().length > 0));
