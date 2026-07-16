import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listSum,
  listToArray,
} from '../../src/algorithms/recursion/recursive-list-sum/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/recursive-list-sum/trace.ts';

test('listSum 基本求和', () => {
  assert.equal(listSum(buildList([3, 1, 4, 1, 5, 9])), 23);
});

test('listSum 空链表', () => {
  assert.equal(listSum(buildList([])), 0);
  assert.equal(listSum(null), 0);
});

test('listSum 单节点', () => {
  assert.equal(listSum(buildList([42])), 42);
});

test('listSum 含负数', () => {
  assert.equal(listSum(buildList([5, -3, 2, -8])), -4);
});

test('listSum 不修改原链表', () => {
  const head = buildList([1, 2, 3]);
  listSum(head);
  assert.deepEqual(listToArray(head), [1, 2, 3]);
});

test('listSum 钩子触发', () => {
  let visits = 0;
  let bases = 0;
  listSum(buildList([1, 2, 3]), {
    onVisit: () => visits++,
    onBase: () => bases++,
  });
  assert.equal(visits, 3);
  assert.equal(bases, 1);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
});
