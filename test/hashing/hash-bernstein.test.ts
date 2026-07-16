import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bernstein } from '../../src/algorithms/hashing/hash-bernstein/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/hashing/hash-bernstein/trace.ts';

test('bernstein 确定性', () => {
  assert.equal(bernstein('hello'), bernstein('hello'));
});
test('bernstein 不同输入不同', () => {
  assert.notEqual(bernstein('hello'), bernstein('world'));
});
test('bernstein 空输入 = 5381', () => {
  assert.equal(bernstein(''), 5381);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace(DEFAULT_INPUT).length >= 3);
});
