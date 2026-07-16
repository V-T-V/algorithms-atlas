import { test } from 'node:test';
import assert from 'node:assert/strict';
import { digitalRoot } from '../../src/algorithms/misc/misc-digital-root/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-digital-root/trace.ts';
test('38 数根=2', () => {
  assert.equal(digitalRoot(38), 2);
});
test('9 的倍数数根=9', () => {
  assert.equal(digitalRoot(999), 9);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
