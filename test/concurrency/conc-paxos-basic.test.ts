import { test } from 'node:test';
import assert from 'node:assert/strict';
import { basicPaxos } from '../../src/algorithms/concurrency/conc-paxos-basic/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-paxos-basic/trace.ts';
test('paxos 多数派选定', () => assert.equal(basicPaxos(5, 42).chosen, 42));
test('paxos trace 非空', () => assert.ok(buildTrace().length >= 2));
