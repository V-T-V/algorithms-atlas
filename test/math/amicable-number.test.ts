import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  amicablePartner,
  findAmicablePairs,
  sumProperDivisors,
} from '../../src/algorithms/math/amicable-number/impl.ts';

test('amicable 220 ↔ 284', () => {
  const r = amicablePartner(220);
  assert.equal(r.amicable, true);
  assert.equal(r.partner, 284);
});

test('amicable 反向 284 ↔ 220', () => {
  const r = amicablePartner(284);
  assert.equal(r.amicable, true);
  assert.equal(r.partner, 220);
});

test('amicable 完全数 6 无配对', () => {
  // σ(6)=6 自指 → 非亲和（a != b 要求）
  assert.equal(amicablePartner(6).amicable, false);
});

test('amicable 素数无配对', () => {
  // σ(7)=1，1 非配对
  assert.equal(amicablePartner(7).amicable, false);
});

test('amicable sumProperDivisors', () => {
  assert.equal(sumProperDivisors(220), 284);
  assert.equal(sumProperDivisors(284), 220);
});

test('amicable 区间搜索', () => {
  const pairs = findAmicablePairs(300);
  assert.deepEqual(pairs, [[220, 284]]);
});

test('amicable 大区间含多对', () => {
  const pairs = findAmicablePairs(2000);
  // (220,284), (1184,1210)
  assert.ok(pairs.some(([a, b]) => a === 220 && b === 284));
  assert.ok(pairs.some(([a, b]) => a === 1184 && b === 1210));
});

test('amicable 钩子被调用', () => {
  const pairs: Array<[number, number]> = [];
  findAmicablePairs(300, { onPair: (a, b) => pairs.push([a, b]) });
  assert.deepEqual(pairs, [[220, 284]]);
});
