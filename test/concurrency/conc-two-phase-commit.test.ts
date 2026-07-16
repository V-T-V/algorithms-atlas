import { test } from 'node:test';
import assert from 'node:assert/strict';
import { twoPhaseCommit } from '../../src/algorithms/concurrency/conc-two-phase-commit/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-two-phase-commit/trace.ts';
test('2pc 全 yes 提交', () => assert.equal(twoPhaseCommit(3, [true, true, true]), 'commit'));
test('2pc 有 no 中止', () => assert.equal(twoPhaseCommit(3, [true, false, true]), 'abort'));
test('2pc trace 非空', () => assert.ok(buildTrace().length >= 2));
