import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lookAndSay } from '../../src/algorithms/misc/misc-look-and-say/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-look-and-say/trace.ts';
test('1->11->21->1211', () => {
  const t = lookAndSay('1', 3);
  assert.deepEqual(t.slice(0, 4), ['1', '11', '21', '1211']);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
