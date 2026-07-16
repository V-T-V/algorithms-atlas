import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateTas } from '../../src/algorithms/concurrency/conc-mutex-tas/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-mutex-tas/trace.ts';

test('conc-mutex-tas 互斥：同时只有一个 critical', () => {
  const events = [
    { thread: 0, action: 'lock' as const },
    { thread: 1, action: 'lock' as const },
    { thread: 0, action: 'unlock' as const },
    { thread: 1, action: 'unlock' as const },
  ];
  const steps = simulateTas(2, events);
  for (const s of steps) {
    const crit = s.states.filter((x) => x === 'critical').length;
    assert.ok(crit <= 1, '至多一个线程在临界区');
  }
  const last = steps[steps.length - 1]!;
  assert.equal(last.flag, 0);
});

test('conc-mutex-tas 等待者被唤醒', () => {
  const events = [
    { thread: 0, action: 'lock' as const },
    { thread: 1, action: 'lock' as const },
    { thread: 0, action: 'unlock' as const },
  ];
  const steps = simulateTas(2, events);
  const last = steps[steps.length - 1]!;
  assert.equal(last.states[1], 'critical');
});

test('conc-mutex-tas trace 生成帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length > 2);
});
