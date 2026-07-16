import { test } from 'node:test';
import assert from 'node:assert/strict';
import { raftLeaderElection } from '../../src/algorithms/concurrency/conc-raft-leader/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-raft-leader/trace.ts';
test('raft 多数当选', () => assert.equal(raftLeaderElection(5, 1, 3).leader, 1));
test('raft 不足落选', () => assert.equal(raftLeaderElection(5, 1, 2).leader, null));
test('raft trace 非空', () => assert.ok(buildTrace().length >= 2));
