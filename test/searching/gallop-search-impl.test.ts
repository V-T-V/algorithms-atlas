import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gallopSearch } from '../../src/algorithms/searching/gallop-search-impl/impl.ts';

const ARR = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29];

test('gallopSearch 命中各位置', () => {
  for (let i = 0; i < ARR.length; i++) {
    assert.equal(gallopSearch(ARR, ARR[i]!), i, `应命中下标 ${i}`);
  }
});

test('gallopSearch 未命中返回 -1', () => {
  assert.equal(gallopSearch(ARR, 0), -1);
  assert.equal(gallopSearch(ARR, 30), -1);
  assert.equal(gallopSearch(ARR, 8), -1);
  assert.equal(gallopSearch([], 5), -1);
});

test('gallopSearch 边界', () => {
  assert.equal(gallopSearch([5], 5), 0);
  assert.equal(gallopSearch([5], 3), -1);
  assert.equal(gallopSearch([1, 2], 2), 1);
});

test('gallopSearch 钩子被调用', () => {
  let gallops = 0;
  let windows = 0;
  let done = 0;
  gallopSearch(ARR, 15, {
    onGallop: () => gallops++,
    onWindow: () => windows++,
    onDone: () => done++,
  });
  assert.ok(gallops >= 1, '应至少飞驰一次');
  assert.equal(windows, 1, '应恰好定位一次区间');
  assert.equal(done, 1, '应恰好回调一次 onDone');
});
