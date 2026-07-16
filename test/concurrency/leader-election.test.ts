import { test } from 'node:test';
import assert from 'node:assert/strict';
import { electLeader } from '../../src/algorithms/concurrency/leader-election/impl.ts';

test('LCR 选出最大 id 作为领导者', () => {
  const r = electLeader([3, 7, 1, 5, 9, 2]);
  assert.equal(r.leaderId, 9);
  assert.equal(r.leader, 4); // ids[4]=9
});

test('LCR 所有人最终知晓领导者', () => {
  const r = electLeader([3, 7, 1, 5, 9, 2]);
  for (const k of r.knownLeader) {
    assert.equal(k, 4);
  }
});

test('LCR 最大值在任意位置都能当选', () => {
  for (const ids of [
    [5, 1, 2, 3, 4],
    [1, 2, 5, 3, 4],
    [1, 2, 3, 4, 5],
    [5, 4, 3, 2, 1],
  ]) {
    const r = electLeader([...ids]);
    assert.equal(r.leaderId, 5);
  }
});

test('LCR 单进程环：自己当选', () => {
  const r = electLeader([42]);
  assert.equal(r.leaderId, 42);
  assert.equal(r.leader, 0);
  assert.equal(r.knownLeader[0], 0);
});

test('LCR 消息数为正', () => {
  const r = electLeader([3, 7, 1]);
  assert.ok(r.messageCount > 0);
});

test('LCR 钩子 onElect 触发一次', () => {
  let electCount = 0;
  let electedId = -1;
  electLeader([2, 5, 1], {
    onElect: (_p, id) => {
      electCount++;
      electedId = id;
    },
  });
  assert.equal(electCount, 1);
  assert.equal(electedId, 5);
});
