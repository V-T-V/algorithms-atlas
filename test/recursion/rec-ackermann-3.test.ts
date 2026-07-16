import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recAckermann3 } from '../../src/algorithms/recursion/rec-ackermann-3/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-ackermann-3/trace.ts';

test('rec-ackermann-3 基本正确性', () => {
  const r = recAckermann3(2, 3);
  assert.equal(r.result, 9);
});

test('rec-ackermann-3 调用次数 > 0', () => {
  const r = recAckermann3(2, 3);
  assert.ok(r.calls > 0);
  assert.ok(r.depth >= 0);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});
