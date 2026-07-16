import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ofbEncrypt } from '../../src/algorithms/crypto/crypto-ofb-mode-generic/impl.ts';
import { buildTrace } from '../../src/algorithms/crypto/crypto-ofb-mode-generic/trace.ts';
const E = (b: number[]) => b.map((x) => x + 1);
test('ofb 确定性', () => {
  const a = ofbEncrypt(
    [
      [1, 2],
      [1, 2],
    ],
    [0, 0],
    E,
  );
  const b = ofbEncrypt(
    [
      [1, 2],
      [1, 2],
    ],
    [0, 0],
    E,
  );
  assert.deepEqual(a, b);
});
test('ofb trace 非空', () => assert.ok(buildTrace().length > 0));
