import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulatePeterson } from '../../src/algorithms/concurrency/peterson-algorithm/impl.ts';

test('peterson 互斥性：两线程不能同时进入临界区', () => {
  const snaps = simulatePeterson([
    { thread: 0, action: 'lock' }, // T0 进入
    { thread: 1, action: 'lock' }, // T1 应等待
    { thread: 0, action: 'critical' },
    { thread: 0, action: 'unlock' }, // 唤醒 T1
    { thread: 1, action: 'critical' },
    { thread: 1, action: 'unlock' },
  ]);
  for (const s of snaps) {
    // 互斥：inCritical 至多一个；两个 state 不能同时为 critical
    const c0 = s.states[0] === 'critical';
    const c1 = s.states[1] === 'critical';
    assert.ok(!(c0 && c1), `互斥违反：两线程同时在临界区 @ ${JSON.stringify(s)}`);
  }
});

test('peterson T0 先 lock 直接进入', () => {
  const snaps = simulatePeterson([{ thread: 0, action: 'lock' }]);
  assert.equal(snaps[0]!.states[0], 'critical');
  assert.equal(snaps[0]!.inCritical, 0);
  // 谦让：turn 设为 1（对方）
  assert.equal(snaps[0]!.turn, 1);
  assert.equal(snaps[0]!.flag[0], true);
});

test('peterson 对方持有 时另一方等待', () => {
  const snaps = simulatePeterson([
    { thread: 0, action: 'lock' }, // T0 进入
    { thread: 1, action: 'lock' }, // T1 等待
  ]);
  // 第二帧：T0 在临界区，T1 等待
  const s2 = snaps[1]!;
  assert.equal(s2.states[0], 'critical');
  assert.equal(s2.states[1], 'waiting');
  assert.equal(s2.inCritical, 0);
});

test('peterson unlock 唤醒等待的对方', () => {
  const snaps = simulatePeterson([
    { thread: 0, action: 'lock' },
    { thread: 1, action: 'lock' }, // 等待
    { thread: 0, action: 'unlock' }, // 唤醒 T1
  ]);
  // 第三帧：T1 进入临界区
  const s3 = snaps[2]!;
  assert.equal(s3.inCritical, 1);
  assert.equal(s3.states[1], 'critical');
  assert.equal(s3.states[0], 'idle');
  assert.equal(s3.flag[0], false);
});

test('peterson 钩子反映 flag / yield / enter', () => {
  const flags: Array<[0 | 1, boolean]> = [];
  const yields: Array<[0 | 1, 0 | 1]> = [];
  const enters: Array<0 | 1> = [];
  simulatePeterson([{ thread: 0, action: 'lock' }], {
    onFlag: (t, f) => flags.push([t, f[t]]),
    onYield: (t, tn) => yields.push([t, tn]),
    onEnter: (t) => enters.push(t),
  });
  assert.deepEqual(flags, [[0, true]]);
  assert.deepEqual(yields, [[0, 1]]); // T0 把 turn 让给 1
  assert.deepEqual(enters, [0]);
});
