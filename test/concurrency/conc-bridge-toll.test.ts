import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateBridge } from '../../src/algorithms/concurrency/conc-bridge-toll/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-bridge-toll/trace.ts';

test('conc-bridge-toll 同向可共享', () => {
  const steps = simulateBridge([
    { car: 1, dir: 'N', action: 'arrive' },
    { car: 2, dir: 'N', action: 'arrive' },
  ]);
  assert.equal(steps[1]!.onBridge, 2);
  assert.equal(steps[1]!.currentDir, 'N');
});

test('conc-bridge-toll 反向等待', () => {
  const steps = simulateBridge([
    { car: 1, dir: 'N', action: 'arrive' },
    { car: 2, dir: 'S', action: 'arrive' },
  ]);
  assert.equal(steps[1]!.waitingS, 1);
});

test('conc-bridge-toll 桥空切换方向', () => {
  const steps = simulateBridge([
    { car: 1, dir: 'N', action: 'arrive' },
    { car: 2, dir: 'S', action: 'arrive' },
    { car: 1, dir: 'N', action: 'exit' },
  ]);
  assert.equal(steps[2]!.currentDir, 'S');
  assert.equal(steps[2]!.onBridge, 1);
});

test('conc-bridge-toll trace', () => {
  assert.ok(buildTrace().length > 2);
});
