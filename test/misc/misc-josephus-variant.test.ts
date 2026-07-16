import { test } from 'node:test';
import assert from 'node:assert/strict';
import { josephusVariant } from '../../src/algorithms/misc/misc-josephus-variant/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-josephus-variant/trace.ts';
test('J(41,3)=30', () => {
  assert.equal(josephusVariant(41, 3), 30);
});
test('J(5,2)=2', () => {
  assert.equal(josephusVariant(5, 2), 2);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
