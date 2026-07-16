import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crt } from '../../src/algorithms/misc/misc-chinese-remain/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-chinese-remain/trace.ts';
test('经典 CRT 23', () => {
  const x = crt([2, 3, 2], [3, 5, 7]);
  assert.equal(x % 3, 2);
  assert.equal(x % 5, 3);
  assert.equal(x % 7, 2);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
