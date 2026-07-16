import { test } from 'node:test';
import assert from 'node:assert/strict';
import { equalByFingerprint } from '../../src/algorithms/randomized/rand-fingerprint/impl.ts';
test('相等字符串匹配', () => {
  assert.equal(equalByFingerprint('hello', 'hello', 42), true);
});
