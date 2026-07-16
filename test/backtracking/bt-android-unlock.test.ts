import { test } from 'node:test';
import assert from 'node:assert/strict';
import { btAndroidUnlock } from '../../src/algorithms/backtracking/bt-android-unlock/impl.ts';

test('bt-android-unlock 长度 1 有 9 个', () => {
  assert.equal(btAndroidUnlock(1).length, 9);
});

test('bt-android-unlock 每个模式长度正确', () => {
  const res = btAndroidUnlock(3);
  for (const p of res) assert.equal(p.length, 3);
});

test('bt-android-unlock 长度 2 = 56', () => {
  assert.equal(btAndroidUnlock(2).length, 56);
});

test('bt-android-unlock 无重复', () => {
  const res = btAndroidUnlock(3);
  const set = new Set(res.map((p) => p.join(',')));
  assert.equal(res.length, set.size);
});
