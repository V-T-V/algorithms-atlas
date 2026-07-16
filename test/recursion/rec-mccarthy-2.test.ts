import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recMccarthy2 } from '../../src/algorithms/recursion/rec-mccarthy-2/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-mccarthy-2/trace.ts';

test('rec-mccarthy-2 基本正确性', () => {
  const r = recMccarthy2(50);
  assert.equal(r.result, 91);
});

test('rec-mccarthy-2 调用次数 > 0', () => {
  const r = recMccarthy2(50);
  assert.ok(r.calls > 0);
  assert.ok(r.depth >= 0);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});
