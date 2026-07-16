import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ladderLength } from '../../src/algorithms/network/net-word-ladder/impl.ts';
import { buildTrace } from '../../src/algorithms/network/net-word-ladder/trace.ts';
test('ladderLength 正确', () => {
  assert.equal(ladderLength('hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log', 'cog']), 5);
  assert.equal(ladderLength('hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log']), 0);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
