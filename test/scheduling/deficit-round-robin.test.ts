import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deficitRoundRobin } from '../../src/algorithms/scheduling/deficit-round-robin/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/deficit-round-robin/trace.ts';

test('deficitRoundRobin 所有包都被发送', () => {
  const r = deficitRoundRobin(
    [
      { flow: 'A', packets: [200, 200] },
      { flow: 'B', packets: [600, 200] },
    ],
    500,
  );
  assert.equal(r.sent.length, 4);
});

test('deficitRoundRobin 大包需多轮累积赤字', () => {
  const r = deficitRoundRobin(
    [
      { flow: 'A', packets: [200] },
      { flow: 'B', packets: [900] },
    ],
    500,
  );
  // A 第一轮发 200；B 需要两轮（500+500=1000 >= 900）
  assert.equal(r.flowBytes['A'], 200);
  assert.equal(r.flowBytes['B'], 900);
  assert.ok(r.rounds >= 2);
});

test('deficitRoundRobin 字节按流分配', () => {
  const r = deficitRoundRobin(
    [
      { flow: 'A', packets: [100, 100] },
      { flow: 'B', packets: [100, 100] },
    ],
    200,
  );
  assert.equal(r.flowBytes['A'], 200);
  assert.equal(r.flowBytes['B'], 200);
});

test('deficitRoundRobin 空流', () => {
  const r = deficitRoundRobin([{ flow: 'A', packets: [] }]);
  assert.equal(r.sent.length, 0);
});

test('deficitRoundRobin 钩子触发', () => {
  let rounds = 0;
  let sends = 0;
  deficitRoundRobin(
    [
      { flow: 'A', packets: [200] },
      { flow: 'B', packets: [200] },
    ],
    500,
    {
      onRound: () => rounds++,
      onSend: () => sends++,
    },
  );
  assert.ok(rounds >= 1);
  assert.equal(sends, 2);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
});
