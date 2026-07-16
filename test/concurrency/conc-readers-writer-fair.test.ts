import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateRwFair } from '../../src/algorithms/concurrency/conc-readers-writer-fair/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-readers-writer-fair/trace.ts';

test('conc-readers-writer-fair 多读者可并发', () => {
  const steps = simulateRwFair([
    { thread: 1, role: 'reader', action: 'acquire' },
    { thread: 2, role: 'reader', action: 'acquire' },
  ]);
  assert.equal(steps[1]!.activeReaders, 2);
});

test('conc-readers-writer-fair 写者独占', () => {
  const steps = simulateRwFair([
    { thread: 0, role: 'writer', action: 'acquire' },
    { thread: 1, role: 'reader', action: 'acquire' },
  ]);
  assert.equal(steps[0]!.activeWriter, 1);
  assert.equal(steps[1]!.activeReaders, 0);
  assert.equal(steps[1]!.waiters.length, 1);
});

test('conc-readers-writer-fair 写者优先排队（公平）', () => {
  const steps = simulateRwFair([
    { thread: 1, role: 'reader', action: 'acquire' },
    { thread: 0, role: 'writer', action: 'acquire' },
    { thread: 2, role: 'reader', action: 'acquire' }, // 应排在 writer 后
  ]);
  assert.ok(steps[2]!.waiters[0]!.role === 'writer');
});

test('conc-readers-writer-fair trace', () => {
  assert.ok(buildTrace().length > 2);
});
