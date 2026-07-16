import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runSnapshot } from '../../src/algorithms/concurrency/snapshot-algorithm/impl.ts';

test('snapshot 发起者先记录自身状态', () => {
  const states: number[] = [];
  runSnapshot(
    2,
    [
      [0, 1],
      [1, 0],
    ],
    0,
    [{ type: 'marker', from: 0, to: 1 }],
    { onRecordState: (p) => states.push(p) },
  );
  assert.equal(states[0], 0); // 发起者 P0 先记录
});

test('snapshot 收到首个 marker 后记录状态', () => {
  const states: number[] = [];
  runSnapshot(
    2,
    [
      [0, 1],
      [1, 0],
    ],
    0,
    [
      { type: 'marker', from: 0, to: 1 },
      { type: 'marker', from: 1, to: 0 },
    ],
    { onRecordState: (p) => states.push(p) },
  );
  assert.ok(states.includes(0));
  assert.ok(states.includes(1));
});

test('snapshot 首个 marker 后的消息被记入通道快照', () => {
  const r = runSnapshot(
    2,
    [
      [0, 1],
      [1, 0],
    ],
    0,
    [
      { type: 'marker', from: 0, to: 1 }, // P1 记录
      { type: 'message', from: 0, to: 1, payload: 5 }, // 记入 0->1
      { type: 'marker', from: 1, to: 0 },
    ],
  );
  assert.deepEqual(r.channelState.get('0->1'), [5]);
});

test('snapshot 首个 marker 前的消息不计入通道快照', () => {
  const r = runSnapshot(
    2,
    [
      [0, 1],
      [1, 0],
    ],
    0,
    [
      { type: 'message', from: 0, to: 1, payload: 5 }, // 在 P1 记录前，不计入
      { type: 'marker', from: 0, to: 1 },
    ],
  );
  assert.deepEqual(r.channelState.get('0->1'), []);
});

test('snapshot 两进程都完成', () => {
  const r = runSnapshot(
    2,
    [
      [0, 1],
      [1, 0],
    ],
    0,
    [
      { type: 'marker', from: 0, to: 1 },
      { type: 'marker', from: 1, to: 0 },
    ],
  );
  assert.equal(r.completed[0], true);
  assert.equal(r.completed[1], true);
});
