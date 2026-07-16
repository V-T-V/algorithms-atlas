import { test } from 'node:test';
import assert from 'node:assert/strict';
import { firstBadVersion } from '../../src/algorithms/searching/search-first-bad-version/impl.ts';

test('firstBadVersion 基本情形', () => {
  assert.equal(
    firstBadVersion(5, (v) => v >= 4),
    4,
  );
  assert.equal(
    firstBadVersion(5, (v) => v >= 1),
    1,
  );
  assert.equal(
    firstBadVersion(5, (v) => v >= 5),
    5,
  );
});

test('firstBadVersion 单版本', () => {
  assert.equal(
    firstBadVersion(1, () => true),
    1,
  );
});

test('firstBadVersion 大规模', () => {
  assert.equal(
    firstBadVersion(100, (v) => v >= 73),
    73,
  );
  assert.equal(
    firstBadVersion(2126753390, (v) => v >= 1702766719),
    1702766719,
  );
});

test('firstBadVersion 钩子探测次数 ≤ ⌈log n⌉', () => {
  let probes = 0;
  firstBadVersion(1024, (v) => v >= 700, { onProbe: () => probes++ });
  assert.ok(probes <= 11, `probes=${probes}`);
  assert.ok(probes >= 1);
});
