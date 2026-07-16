import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateLamport } from '../../src/algorithms/concurrency/lamport-clock/impl.ts';

test('lamport 本地事件使时钟自增', () => {
  const { clocks, results } = simulateLamport(1, [
    { proc: 0, type: 'local' },
    { proc: 0, type: 'local' },
    { proc: 0, type: 'local' },
  ]);
  assert.equal(clocks[0], 3);
  assert.deepEqual(
    results.map((r) => r.clock),
    [1, 2, 3],
  );
});

test('lamport send 后 receive 取 max+1', () => {
  const { results } = simulateLamport(2, [
    { proc: 0, type: 'send', msgId: 'm1' }, // P0: 1
    { proc: 1, type: 'receive', msgId: 'm1' }, // P1: max(0,1)+1 = 2
  ]);
  assert.equal(results[0]!.clock, 1);
  assert.equal(results[1]!.clock, 2);
  assert.equal(results[1]!.sentTs, 1);
});

test('lamport 接收方时钟已较大时仍取 max+1', () => {
  const { results } = simulateLamport(2, [
    { proc: 0, type: 'local' }, // P0:1
    { proc: 0, type: 'local' }, // P0:2
    { proc: 0, type: 'send', msgId: 'm' }, // P0:3
    { proc: 1, type: 'local' }, // P1:1
    { proc: 1, type: 'local' }, // P1:2
    { proc: 1, type: 'local' }, // P1:3
    { proc: 1, type: 'local' }, // P1:4
    { proc: 1, type: 'local' }, // P1:5
    { proc: 1, type: 'receive', msgId: 'm' }, // max(5,3)+1 = 6
  ]);
  assert.equal(results[results.length - 1]!.clock, 6);
});

test('lamport happens-before: 发送方 C < 接收方 C', () => {
  const { results } = simulateLamport(2, [
    { proc: 0, type: 'send', msgId: 'm1' },
    { proc: 1, type: 'receive', msgId: 'm1' },
  ]);
  const sendClock = results[0]!.clock;
  const recvClock = results[1]!.clock;
  assert.ok(sendClock < recvClock);
});

test('lamport 不同进程时钟独立', () => {
  const { clocks } = simulateLamport(3, [
    { proc: 0, type: 'local' },
    { proc: 2, type: 'local' },
    { proc: 2, type: 'local' },
  ]);
  assert.equal(clocks[0], 1);
  assert.equal(clocks[1], 0);
  assert.equal(clocks[2], 2);
});
