import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscCountAndSay } from '../../src/algorithms/misc/misc-count-and-say/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-count-and-say/trace.ts';
test('count-and-say 前 5 项', () => {
  assert.equal(miscCountAndSay(1), '1');
  assert.equal(miscCountAndSay(2), '11');
  assert.equal(miscCountAndSay(3), '21');
  assert.equal(miscCountAndSay(4), '1211');
  assert.equal(miscCountAndSay(5), '111221');
});
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
