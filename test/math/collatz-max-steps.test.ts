import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  collatzStepsMemo,
  collatzStepCount,
} from '../../src/algorithms/math/collatz-max-steps/impl.ts';

test('collatz-max-steps 单步数 1 = 0', () => {
  assert.equal(collatzStepCount(1), 0);
});

test('collatz-max-steps 27 = 111', () => {
  assert.equal(collatzStepCount(27), 111);
});

test('collatz-max-steps 记录保持者正确', () => {
  const { records, best } = collatzStepsMemo(30);
  // 记录保持者序列首项是 1（步数 0）
  assert.equal(records[0]!.value, 1);
  // 27 在 [1,30] 中步数 111，是最大
  assert.equal(best.value, 27);
  assert.equal(best.steps, 111);
});

test('collatz-max-steps 步数严格递增', () => {
  const { records } = collatzStepsMemo(100);
  for (let i = 1; i < records.length; i++) {
    assert.ok(records[i]!.steps > records[i - 1]!.steps, 'steps should strictly increase');
    assert.ok(records[i]!.value > records[i - 1]!.value, 'values should strictly increase');
  }
});

test('collatz-max-steps n=1', () => {
  const { records, best } = collatzStepsMemo(1);
  assert.equal(records.length, 1);
  assert.equal(best.value, 1);
  assert.equal(best.steps, 0);
});

test('collatz-max-steps n=0', () => {
  const { records } = collatzStepsMemo(0);
  assert.equal(records.length, 0);
});

test('collatz-max-steps 钩子被调用', () => {
  let records = 0;
  collatzStepsMemo(20, { onRecord: () => records++ });
  assert.ok(records > 0);
});
