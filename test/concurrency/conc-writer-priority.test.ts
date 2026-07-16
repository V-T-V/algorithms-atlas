import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateWriterPriority } from '../../src/algorithms/concurrency/conc-writer-priority/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-writer-priority/trace.ts';

test('conc-writer-priority 新读者因写者等待而阻塞', () => {
  const steps = simulateWriterPriority([
    { thread: 1, role: 'reader', action: 'acquire' },
    { thread: 0, role: 'writer', action: 'acquire' },
    { thread: 2, role: 'reader', action: 'acquire' },
  ]);
  assert.equal(steps[2]!.waitingReaders, 1);
  assert.equal(steps[2]!.activeReaders, 1);
});

test('conc-writer-priority 写者释放后读者涌入', () => {
  const steps = simulateWriterPriority([
    { thread: 0, role: 'writer', action: 'acquire' },
    { thread: 1, role: 'reader', action: 'acquire' },
    { thread: 0, role: 'writer', action: 'release' },
  ]);
  assert.equal(steps[2]!.activeReaders, 1);
});

test('conc-writer-priority trace', () => {
  assert.ok(buildTrace().length > 2);
});
