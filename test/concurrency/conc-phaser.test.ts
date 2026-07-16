import { test } from 'node:test';
import assert from 'node:assert/strict';
import { phaserSync } from '../../src/algorithms/concurrency/conc-phaser/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-phaser/trace.ts';
test('phaser 完成阶段数', () => assert.equal(phaserSync(3, 4), 4));
test('phaser trace 非空', () => assert.ok(buildTrace().length >= 2));
