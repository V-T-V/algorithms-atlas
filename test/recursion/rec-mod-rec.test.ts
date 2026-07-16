import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recModRec } from '../../src/algorithms/recursion/rec-mod-rec/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-mod-rec/trace.ts';

test('rec-mod-rec 基本正确性', () => {
  const r = recModRec(17, 5);
  assert.equal(r.result, 2);
});

test('rec-mod-rec 调用次数 > 0', () => {
  const r = recModRec(17, 5);
  assert.ok(r.calls > 0);
  assert.ok(r.depth >= 0);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});
