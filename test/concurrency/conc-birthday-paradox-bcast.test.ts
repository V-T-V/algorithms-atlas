import { test } from 'node:test';
import assert from 'node:assert/strict';
import { brachaBroadcast } from '../../src/algorithms/concurrency/conc-birthday-paradox-bcast/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-birthday-paradox-bcast/trace.ts';
test('bracha n=4f=1 全投递', () => assert.equal(brachaBroadcast(4, 1).delivered, 4));
test('bracha trace 非空', () => assert.ok(buildTrace().length >= 2));
