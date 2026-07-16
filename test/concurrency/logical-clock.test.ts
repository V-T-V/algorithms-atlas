import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  runClock,
  scalarRules,
  vectorRules,
  scalarValue,
  vectorValue,
  isVectorClock,
} from '../../src/algorithms/concurrency/logical-clock/impl.ts';

test('logicalClock scalar: 本地事件自增', () => {
  const { clocks } = runClock(scalarRules(3), [{ proc: 1, type: 'local' }]);
  assert.equal(scalarValue(clocks, 1), 1);
  assert.equal(scalarValue(clocks, 0), 0);
});

test('logicalClock scalar: send 后 receive 取 max+1', () => {
  const { clocks } = runClock(scalarRules(2), [
    { proc: 0, type: 'send', msgId: 'm' },
    { proc: 1, type: 'receive', msgId: 'm' },
  ]);
  assert.equal(scalarValue(clocks, 0), 1);
  assert.equal(scalarValue(clocks, 1), 2);
});

test('logicalClock vector: 本地事件只自增本维', () => {
  const { clocks } = runClock(vectorRules(3), [{ proc: 2, type: 'local' }]);
  assert.deepEqual(vectorValue(clocks, 2), [0, 0, 1]);
  assert.deepEqual(vectorValue(clocks, 0), [0, 0, 0]);
  assert.ok(isVectorClock(clocks));
});

test('logicalClock vector: receive 逐维 max 后自增', () => {
  const { clocks } = runClock(vectorRules(2), [
    { proc: 0, type: 'local' },
    { proc: 0, type: 'send', msgId: 'm' }, // V0=[2,0]
    { proc: 1, type: 'receive', msgId: 'm' }, // max([0,0],[2,0])=[2,0] → V1=[2,1]
  ]);
  assert.deepEqual(vectorValue(clocks, 1), [2, 1]);
});

test('logicalClock scalar 与 vector 在同一序列下结果合理', () => {
  const events = [
    { proc: 0, type: 'local' as const },
    { proc: 0, type: 'send' as const, msgId: 'm1' },
    { proc: 1, type: 'receive' as const, msgId: 'm1' },
  ];
  const s = runClock(scalarRules(2), events).clocks;
  const v = runClock(vectorRules(2), events).clocks;
  // P0 标量 = 2，P1 标量 = 3
  assert.equal(scalarValue(s, 0), 2);
  assert.equal(scalarValue(s, 1), 3);
  // P1 向量至少在 0 维 >= 2（继承了 P0 的计数）
  assert.ok(vectorValue(v, 1)[0]! >= 2);
});

test('logicalClock 钩子每个事件触发一次', () => {
  let n = 0;
  runClock(
    scalarRules(1),
    [
      { proc: 0, type: 'local' },
      { proc: 0, type: 'local' },
    ],
    { onEvent: () => n++ },
  );
  assert.equal(n, 2);
});
