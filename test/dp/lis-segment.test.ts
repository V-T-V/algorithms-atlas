import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lisSegment } from '../../src/algorithms/dp/lis-segment/impl.ts';

test('lis-segment 基本行为', () => {
  assert.equal(lisSegment([]), 0);
  assert.equal(lisSegment([1]), 1);
});

test('lis-segment 经典用例', () => {
  assert.equal(lisSegment([10, 9, 2, 5, 3, 7, 101, 18]), 4);
  assert.equal(lisSegment([0, 1, 0, 3, 2, 3]), 4);
  assert.equal(lisSegment([7, 7, 7, 7]), 1); // 严格递增 → 1
  assert.equal(lisSegment([1, 2, 3, 4, 5]), 5);
  assert.equal(lisSegment([5, 4, 3, 2, 1]), 1);
});

test('lis-segment 含负数', () => {
  assert.equal(lisSegment([-1, 0, -2, 3]), 3); // -1,0,3
});

test('lis-segment 与二分版对拍', () => {
  const dp = (a: number[]): number => {
    const tails: number[] = [];
    for (const x of a) {
      let lo = 0;
      let hi = tails.length;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (tails[mid]! < x) lo = mid + 1;
        else hi = mid;
      }
      if (lo === tails.length) tails.push(x);
      else tails[lo] = x;
    }
    return tails.length;
  };
  const rng = (s: number) => () => (s = (s * 1103515245 + 12345) & 0x7fffffff);
  const rand = rng(99);
  for (let t = 0; t < 300; t++) {
    const len = rand() % 25;
    const a: number[] = [];
    for (let i = 0; i < len; i++) a.push((rand() % 20) - 5);
    assert.equal(lisSegment(a), dp(a), `mismatch on ${JSON.stringify(a)}`);
  }
});

test('lis-segment 钩子被调用', () => {
  let visit = 0;
  let query = 0;
  let update = 0;
  let done = -1;
  lisSegment([10, 9, 2, 5, 3, 7, 101, 18], {
    onVisit: () => visit++,
    onQuery: () => query++,
    onUpdate: () => update++,
    onDone: (n) => {
      done = n;
    },
  });
  assert.equal(visit, 8);
  assert.equal(query, 8);
  assert.equal(update, 8);
  assert.equal(done, 4);
});
