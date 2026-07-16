import { test } from 'node:test';
import assert from 'node:assert/strict';
import { disseminationBarrier } from '../../src/algorithms/concurrency/conc-dissemination-barrier/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-dissemination-barrier/trace.ts';
test('db 8 线程 3 轮', () => assert.equal(disseminationBarrier(8), 3));
test('db trace 非空', () => assert.ok(buildTrace().length >= 2));
