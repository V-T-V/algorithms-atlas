import { test } from 'node:test';
import assert from 'node:assert/strict';
import { russianDoll } from '../../src/algorithms/dp/russian-doll/impl.ts';

test('russian-doll 基本行为', () => {
  assert.equal(russianDoll([]), 0);
  assert.equal(russianDoll([{ w: 1, h: 1 }]), 1);
});

test('russian-doll 经典用例', () => {
  // LeetCode 354：envelopes = [[5,4],[6,4],[6,7],[2,3]] → 3 ([2,3]→[5,4]→[6,7])
  assert.equal(
    russianDoll([
      { w: 5, h: 4 },
      { w: 6, h: 4 },
      { w: 6, h: 7 },
      { w: 2, h: 3 },
    ]),
    3,
  );
  // 全部不能嵌套（同尺寸）
  assert.equal(
    russianDoll([
      { w: 1, h: 1 },
      { w: 1, h: 1 },
      { w: 1, h: 1 },
    ]),
    1,
  );
});

test('russian-doll 严格大小判定', () => {
  // 一条链
  assert.equal(
    russianDoll([
      { w: 1, h: 1 },
      { w: 2, h: 2 },
      { w: 3, h: 3 },
      { w: 4, h: 4 },
    ]),
    4,
  );
  // 宽同高同不可嵌
  assert.equal(
    russianDoll([
      { w: 2, h: 3 },
      { w: 2, h: 3 },
    ]),
    1,
  );
});

test('russian-doll 同宽不同高至多取一', () => {
  // w 全为 5，h 递增 → 同宽不可嵌套，应只取 1
  assert.equal(
    russianDoll([
      { w: 5, h: 1 },
      { w: 5, h: 2 },
      { w: 5, h: 3 },
    ]),
    1,
  );
});

test('russian-doll 钩子被调用', () => {
  let visit = 0;
  let place = 0;
  let done = -1;
  russianDoll(
    [
      { w: 5, h: 4 },
      { w: 6, h: 4 },
      { w: 6, h: 7 },
      { w: 2, h: 3 },
    ],
    {
      onVisit: () => visit++,
      onPlace: () => place++,
      onDone: (d) => {
        done = d;
      },
    },
  );
  assert.equal(visit, 4);
  assert.equal(place, 4);
  assert.equal(done, 3);
});
