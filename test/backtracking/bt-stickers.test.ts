import { test } from 'node:test';
import assert from 'node:assert/strict';
import { minStickers } from '../../src/algorithms/backtracking/bt-stickers/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-stickers/trace.ts';
test('minStickers 正确', () => {
  assert.equal(minStickers(['with', 'example', 'science'], 'thehat'), 3);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
