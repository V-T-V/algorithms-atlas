import { test } from 'node:test';
import assert from 'node:assert/strict';
import { jenkins } from '../../src/algorithms/hashing/hash-jenkins/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/hashing/hash-jenkins/trace.ts';

test('jenkins 确定性', () => {
  assert.equal(jenkins('hello'), jenkins('hello'));
});
test('jenkins 不同输入不同', () => {
  assert.notEqual(jenkins('hello'), jenkins('world'));
});
test('jenkins 空输入 = 0', () => {
  assert.equal(jenkins(''), 0);
});
test('jenkins 雪崩性', () => {
  const a = jenkins('abcdefghijklmnop');
  const b = jenkins('abcdefghijklnop');
  let diff = 0;
  const x = a ^ b;
  for (let i = 0; i < 32; i++) if ((x >>> i) & 1) diff++;
  assert.ok(diff >= 8);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace(DEFAULT_INPUT).length >= 3);
});
