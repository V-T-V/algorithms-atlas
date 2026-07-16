import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listLength,
} from '../../src/algorithms/recursion/recursive-list-length/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/recursive-list-length/trace.ts';

test('listLength 基本长度', () => {
  assert.equal(listLength(buildList([1, 2, 3, 4, 5])), 5);
});

test('listLength 空链表', () => {
  assert.equal(listLength(buildList([])), 0);
  assert.equal(listLength(null), 0);
});

test('listLength 单节点', () => {
  assert.equal(listLength(buildList([7])), 1);
});

test('listLength 长链表', () => {
  assert.equal(listLength(buildList(Array.from({ length: 100 }, (_, i) => i))), 100);
});

test('listLength 钩子触发', () => {
  let visits = 0;
  listLength(buildList([1, 2, 3]), { onVisit: () => visits++ });
  assert.equal(visits, 3);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
});
