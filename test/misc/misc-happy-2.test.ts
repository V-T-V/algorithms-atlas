import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscHappy2 } from '../../src/algorithms/misc/misc-happy-2/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-happy-2/trace.ts';
test('19 是快乐数', () => {
  assert.equal(miscHappy2(19), true);
});
test('2 不是快乐数', () => {
  assert.equal(miscHappy2(2), false);
});
test('1 是快乐数', () => {
  assert.equal(miscHappy2(1), true);
});
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
