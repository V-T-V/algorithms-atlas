import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateTtas } from '../../src/algorithms/concurrency/conc-mutex-ttas/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-mutex-ttas/trace.ts';

test('conc-mutex-ttas 互斥成立', () => {
  const steps = simulateTtas(3, [
    { thread: 0, action: 'lock' },
    { thread: 1, action: 'lock' },
    { thread: 0, action: 'unlock' },
    { thread: 1, action: 'unlock' },
  ]);
  for (const s of steps) {
    const crit = s.states.filter((x) => x === 'critical').length;
    assert.ok(crit <= 1);
  }
});

test('conc-mutex-ttas 读自旋计数', () => {
  const steps = simulateTtas(2, [
    { thread: 0, action: 'lock' },
    { thread: 1, action: 'lock' },
  ]);
  const last = steps[steps.length - 1]!;
  assert.ok(last.reads[1]! >= 1, '等待者应有读自旋');
});

test('conc-mutex-ttas trace', () => {
  const frames = buildTrace();
  assert.ok(frames.length > 2);
});
