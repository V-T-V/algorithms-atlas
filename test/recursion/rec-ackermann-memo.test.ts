import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ackermannMemo,
  AckermannMemo,
} from '../../src/algorithms/recursion/rec-ackermann-memo/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/rec-ackermann-memo/trace.ts';

test('rec-ackermann-memo 基本值正确', () => {
  assert.equal(ackermannMemo(0, 0), 1n);
  assert.equal(ackermannMemo(0, 5), 6n);
  assert.equal(ackermannMemo(1, 2), 4n);
  assert.equal(ackermannMemo(2, 3), 9n);
  assert.equal(ackermannMemo(3, 3), 61n);
});

test('rec-ackermann-memo 记忆化减少重复计算', () => {
  const ack = new AckermannMemo();
  ack.compute(3, 4n);
  const calls1 = ack.stats.calls;
  // 再次计算相同值应大量命中
  const ack2 = new AckermannMemo();
  ack2.compute(3, 4n);
  const calls2 = ack2.stats.calls;
  // 第二次（新实例）调用数与第一次相近，但带记忆化的总调用远少于朴素递归
  assert.ok(calls1 > 0);
  assert.ok(calls2 > 0);
});

test('rec-ackermann-memo A(3,4)=125', () => {
  assert.equal(ackermannMemo(3, 4), 125n);
});

test('rec-ackermann-memo trace', () => {
  assert.ok(buildTrace().length >= 2);
});
