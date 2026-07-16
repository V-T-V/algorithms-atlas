import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recBellRec } from '../../src/algorithms/recursion/rec-bell-rec/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-bell-rec/trace.ts';

test('rec-bell-rec 基本正确性', () => {
  const r = recBellRec(5);
  assert.equal(r.result, 52);
});

test('rec-bell-rec 调用次数 > 0', () => {
  const r = recBellRec(5);
  assert.ok(r.calls > 0);
  assert.ok(r.depth >= 0);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});
