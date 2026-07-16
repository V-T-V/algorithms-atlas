import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameGrundyForest } from '../../src/algorithms/game/game-grundy-forest/impl.ts';

test('game-grundy-forest 单茎 SG=1', () => {
  assert.equal(gameGrundyForest([{ id: 'A' }]), 1);
});

test('game-grundy-forest 两棵单茎异或为 0 必败', () => {
  assert.equal(gameGrundyForest([{ id: 'A' }, { id: 'B' }]), 0);
});

test('game-grundy-forest 返回非负整数', () => {
  const sg = gameGrundyForest([{ id: 'A', children: [{ id: 'B' }] }]);
  assert.ok(Number.isInteger(sg) && sg >= 0);
});
