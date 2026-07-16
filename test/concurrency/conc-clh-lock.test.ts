import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clhLock } from '../../src/algorithms/concurrency/conc-clh-lock/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-clh-lock/trace.ts';
test('clh FIFO', () => assert.deepEqual(clhLock([1, 2, 3]), [1, 2, 3]));
test('clh trace 非空', () => assert.ok(buildTrace().length >= 2));
