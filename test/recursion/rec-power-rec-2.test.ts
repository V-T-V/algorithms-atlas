import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recPowerRec2 } from '../../src/algorithms/recursion/rec-power-rec-2/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-power-rec-2/trace.ts';

test('rec-power-rec-2 基本正确性', () => {
  const r = recPowerRec2(2, 10);
  assert.equal(r.result, 1024);
});

test('rec-power-rec-2 调用次数 > 0', () => {
  const r = recPowerRec2(2, 10);
  assert.ok(r.calls > 0);
  assert.ok(r.depth >= 0);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});
