import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cbcEncrypt } from '../../src/algorithms/crypto/crypto-cbc-mode/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-cbc-mode/trace.ts';
const E = (b: number[]) => b.map((x) => x + 1);
test('cbc 相同块不同密文', () => {
  const ct = cbcEncrypt(
    [
      [1, 2],
      [1, 2],
    ],
    [0, 0],
    E,
  );
  assert.notDeepEqual(ct[0], ct[1]);
});
test('cbc trace 非空', () => assert.ok(buildTrace().length > 0));
