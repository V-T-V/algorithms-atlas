import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  metaBinarySearch,
  msbFor,
} from '../../src/algorithms/searching/meta-binary-search/impl.ts';

const ARR = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21];

test('metaBinarySearch 命中各位置', () => {
  for (let i = 0; i < ARR.length; i++) {
    assert.equal(metaBinarySearch(ARR, ARR[i]!), i, `应命中下标 ${i}`);
  }
});

test('metaBinarySearch 未命中返回 -1', () => {
  assert.equal(metaBinarySearch(ARR, 0), -1);
  assert.equal(metaBinarySearch(ARR, 22), -1);
  assert.equal(metaBinarySearch(ARR, 8), -1);
  assert.equal(metaBinarySearch([], 5), -1);
  assert.equal(metaBinarySearch([5], 3), -1);
});

test('msbFor 计算', () => {
  assert.equal(msbFor(1), 0);
  assert.equal(msbFor(2), 1);
  assert.equal(msbFor(3), 1);
  assert.equal(msbFor(4), 2);
  assert.equal(msbFor(11), 3);
  assert.equal(msbFor(16), 4);
});

test('metaBinarySearch 边界', () => {
  assert.equal(metaBinarySearch([5], 5), 0);
  assert.equal(metaBinarySearch([1, 2], 1), 0);
  assert.equal(metaBinarySearch([1, 2], 2), 1);
});

test('metaBinarySearch 钩子被调用', () => {
  let probes = 0;
  let done = 0;
  metaBinarySearch(ARR, 15, {
    onProbe: () => probes++,
    onDone: () => done++,
  });
  assert.ok(probes >= 1, '应至少探测一次');
  assert.equal(done, 1, '应恰好回调一次 onDone');
});
