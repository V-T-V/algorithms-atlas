import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ecbEncrypt } from '../../src/algorithms/crypto/crypto-ecb-mode/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-ecb-mode/trace.ts';
const E = (b: number[]) => b.map((x) => x + 1);
test('ecb 相同块相同密文', () => {
  const ct = ecbEncrypt(
    [
      [1, 2],
      [1, 2],
    ],
    E,
  );
  assert.deepEqual(ct[0], ct[1]);
});
test('ecb trace 非空', () => assert.ok(buildTrace().length > 0));
