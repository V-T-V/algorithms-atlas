import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  makeUniversalHasher,
  universalCollisionRate,
} from '../../src/algorithms/hashing/hash-universal-class/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-universal-class/trace.ts';
test('哈希值在范围内', () => {
  const h = makeUniversalHasher(10, () => 0.5);
  for (let i = 0; i < 100; i++) assert.ok(h(i) < 10);
});
test('碰撞率有界', () => {
  const r = universalCollisionRate(100, [1, 2, 3, 4, 5, 6, 7, 8], () => 0.3);
  assert.ok(r <= 1);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
