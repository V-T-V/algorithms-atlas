import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tournamentBarrier } from '../../src/algorithms/concurrency/conc-tournament-barrier/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-tournament-barrier/trace.ts';
test('tb 8 线程 3 轮', () => assert.equal(tournamentBarrier(8), 3));
test('tb trace 非空', () => assert.ok(buildTrace().length >= 2));
