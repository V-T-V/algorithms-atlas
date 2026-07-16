import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscArrangeCoin2 } from '../../src/algorithms/misc/misc-arrange-coin-2/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-arrange-coin-2/trace.ts';
test('arrangeCoin 5 = 2', () => {
  assert.equal(miscArrangeCoin2(5), 2);
});
test('arrangeCoin 8 = 3', () => {
  assert.equal(miscArrangeCoin2(8), 3);
});
test('arrangeCoin 0 = 0', () => {
  assert.equal(miscArrangeCoin2(0), 0);
});
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
