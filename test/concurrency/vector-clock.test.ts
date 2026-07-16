import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  simulateVectorClock,
  vcLess,
  isConcurrent,
} from '../../src/algorithms/concurrency/vector-clock/impl.ts';

test('vectorClock 本地事件只自增本维', () => {
  const { vectors } = simulateVectorClock(3, [{ proc: 1, type: 'local' }]);
  assert.deepEqual(vectors[1], [0, 1, 0]);
  assert.deepEqual(vectors[0], [0, 0, 0]);
});

test('vectorClock send 自增本维并附向量', () => {
  const { results } = simulateVectorClock(2, [{ proc: 0, type: 'send', msgId: 'm1' }]);
  assert.deepEqual(results[0]!.vector, [1, 0]);
});

test('vectorClock receive 逐维取 max 后自增', () => {
  const { results } = simulateVectorClock(2, [
    { proc: 0, type: 'local' }, // V0=[1,0]
    { proc: 0, type: 'local' }, // V0=[2,0]
    { proc: 0, type: 'send', msgId: 'm' }, // V0=[3,0]
    { proc: 1, type: 'local' }, // V1=[0,1]
    { proc: 1, type: 'receive', msgId: 'm' }, // max([0,1],[3,0])=[3,1] → +1=[3,2]
  ]);
  assert.deepEqual(results[results.length - 1]!.vector, [3, 2]);
});

test('vectorClock vcLess 正确比较', () => {
  assert.equal(vcLess([1, 0], [2, 1]), true);
  assert.equal(vcLess([2, 1], [1, 0]), false);
  assert.equal(vcLess([1, 2], [2, 1]), false); // 不可比较
  assert.equal(vcLess([1, 1], [1, 1]), false); // 相等不算严格小于
});

test('vectorClock isConcurrent 检测并发事件', () => {
  // 两个独立 local 事件，向量 [1,0] 与 [0,1] 并发
  const { results } = simulateVectorClock(2, [
    { proc: 0, type: 'local' },
    { proc: 1, type: 'local' },
  ]);
  const v0 = results[0]!.vector;
  const v1 = results[1]!.vector;
  assert.equal(isConcurrent(v0, v1), true);
});

test('vectorClock 有因果关系的两事件不并发', () => {
  const { results } = simulateVectorClock(2, [
    { proc: 0, type: 'send', msgId: 'm' }, // [1,0]
    { proc: 1, type: 'receive', msgId: 'm' }, // [1,2]
  ]);
  const v0 = results[0]!.vector;
  const v1 = results[1]!.vector;
  assert.equal(isConcurrent(v0, v1), false);
  assert.equal(vcLess(v0, v1), true);
});
