import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  firstBadVersion2,
  type FirstBad2Hooks,
} from '../../src/algorithms/searching/search-first-bad-2/impl.ts';

test('firstBadVersion2 基本', () => {
  assert.equal(
    firstBadVersion2(5, (v) => v >= 4),
    4,
  );
  assert.equal(
    firstBadVersion2(5, (v) => v >= 1),
    1,
  );
  assert.equal(
    firstBadVersion2(10, (v) => v >= 7),
    7,
  );
  assert.equal(
    firstBadVersion2(1, (v) => v >= 1),
    1,
  );
});
test('firstBadVersion2 钩子', () => {
  let c = 0;
  firstBadVersion2(10, (v) => v >= 7, { onCheck: () => c++ } as FirstBad2Hooks);
  assert.ok(c >= 1);
});
