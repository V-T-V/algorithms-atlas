import { test } from 'node:test';
import assert from 'node:assert/strict';
import { des } from '../../src/algorithms/crypto/des/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/crypto/des/trace.ts';

test('des 输出 8 位且确定', () => {
  const { bits } = des([1, 0, 0, 1, 1, 0, 1, 0], [1, 0, 1, 0, 0, 1, 1, 0]);
  assert.equal(bits.length, 8);
  assert.deepEqual(des([1, 0, 0, 1, 1, 0, 1, 0]).bits, des([1, 0, 0, 1, 1, 0, 1, 0]).bits);
});

test('des 对非 8 位输入抛错', () => {
  assert.throws(() => des([1, 0, 1]).bits);
});

test('des 每位为 0 或 1', () => {
  const { bits } = des([0, 1, 1, 0, 1, 0, 0, 1]);
  assert.ok(bits.every((b) => b === 0 || b === 1));
});

test('des 钩子按序触发', () => {
  const steps: string[] = [];
  des([1, 1, 1, 1, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], {
    onPermute: () => steps.push('p'),
    onKeyMix: () => steps.push('k'),
    onSbox: () => steps.push('s'),
  });
  assert.deepEqual(steps, ['p', 'k', 's']);
});

test('buildTrace 含网格', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 4);
  assert.ok(frames[0]!.array2d);
});
