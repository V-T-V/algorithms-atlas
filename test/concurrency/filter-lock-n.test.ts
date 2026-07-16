import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateFilterLock } from '../../src/algorithms/concurrency/filter-lock-n/impl.ts';

test('filter-lock 单线程直接进入临界区', () => {
  const snaps = simulateFilterLock(1, [{ thread: 0, action: 'enterLevel' }]);
  // n=1，level 0+1=1>=n=1，直接临界
  assert.equal(snaps[0]!.phase[0], 'critical');
  assert.deepEqual(snaps[0]!.inCritical, [0]);
});

test('filter-lock 两线程：T0 进入后 T1 在层 1 等待', () => {
  const snaps = simulateFilterLock(2, [
    { thread: 0, action: 'enterLevel' }, // T0 -> level1=n-1 -> critical
    { thread: 1, action: 'enterLevel' }, // T1 -> level1, victim=1, T0 仍在(level1>=1)
  ]);
  assert.equal(snaps[0]!.phase[0], 'critical');
  // T1 进入层 1，victim[1]=1，且 T0 的 level[0]=1>=1，所以 T1 等待
  assert.equal(snaps[1]!.level[1], 1);
  assert.equal(snaps[1]!.victim[1], 1);
});

test('filter-lock 互斥：同一时刻临界区至多一个', () => {
  // 序列化模拟：任意时刻 inCritical 长度 <= 1（因为只有 enterLevel 成功才入）
  const snaps = simulateFilterLock(3, [
    { thread: 0, action: 'enterLevel' },
    { thread: 0, action: 'enterLevel' },
    { thread: 1, action: 'enterLevel' }, // 等待
    { thread: 2, action: 'enterLevel' }, // 等待
    { thread: 0, action: 'exit' },
  ]);
  for (const s of snaps) {
    assert.ok(s.inCritical.length <= 1, `互斥违反: ${JSON.stringify(s.inCritical)}`);
  }
});

test('filter-lock exit 后 level 归 0', () => {
  const snaps = simulateFilterLock(2, [
    { thread: 0, action: 'enterLevel' },
    { thread: 0, action: 'exit' },
  ]);
  const last = snaps[snaps.length - 1]!;
  assert.equal(last.level[0], 0);
  assert.equal(last.phase[0], 'idle');
  assert.equal(last.inCritical.length, 0);
});

test('filter-lock 钩子 onLevel/onVictim 触发', () => {
  const levels: Array<[number, number]> = [];
  const victims: Array<[number, number]> = [];
  simulateFilterLock(3, [{ thread: 1, action: 'enterLevel' }], {
    onLevel: (t, L) => levels.push([t, L]),
    onVictim: (t, L) => victims.push([t, L]),
  });
  // T1 从 level 0 -> 1
  assert.deepEqual(levels, [[1, 1]]);
  assert.deepEqual(victims, [[1, 1]]);
});
