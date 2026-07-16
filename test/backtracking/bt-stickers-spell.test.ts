import { test } from 'node:test';
import assert from 'node:assert/strict';
import { btStickersSpell } from '../../src/algorithms/backtracking/bt-stickers-spell/impl.ts';

test('bt-stickers-spell 基本用例', () => {
  assert.equal(btStickersSpell(['with', 'example', 'science'], 'thehat'), 3);
});

test('bt-stickers-spell 不可拼返回 -1', () => {
  assert.equal(btStickersSpell(['cat', 'dog'], 'xyz'), -1);
});

test('bt-stickers-spell 单张贴纸', () => {
  assert.equal(btStickersSpell(['abc'], 'abc'), 1);
});

test('bt-stickers-spell 空目标需 0 张', () => {
  assert.equal(btStickersSpell(['abc'], ''), 0);
});
