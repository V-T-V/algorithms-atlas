import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscCompareVersion } from '../../src/algorithms/misc/misc-compare-version/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-compare-version/trace.ts';
test('compare "1.01"="1.001" → 0', () => {
  assert.equal(miscCompareVersion('1.01', '1.001'), 0);
});
test('compare "1.0"="1.0.0" → 0', () => {
  assert.equal(miscCompareVersion('1.0', '1.0.0'), 0);
});
test('compare "0.1"<"1.1" → -1', () => {
  assert.equal(miscCompareVersion('0.1', '1.1'), -1);
});
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
