import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cmac } from '../../src/algorithms/hashing/hash-cmac-mac/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-cmac-mac/trace.ts';
test('CMAC 确定性', () => {
  assert.equal(cmac('abc', 1), cmac('abc', 1));
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
