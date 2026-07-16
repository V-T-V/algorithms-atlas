import { test } from 'node:test';
import assert from 'node:assert/strict';
import { happyRange } from '../../src/algorithms/misc/misc-happy-range/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-happy-range/trace.ts';
test('1..30 中有快乐数', () => {
  assert.ok(happyRange(1, 30) > 0);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
