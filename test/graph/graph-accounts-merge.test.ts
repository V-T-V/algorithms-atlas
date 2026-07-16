import { test } from 'node:test';
import assert from 'node:assert/strict';
import { accountsMerge } from '../../src/algorithms/graph/graph-accounts-merge/impl.ts';

test('accounts-merge LeetCode 721 例', () => {
  const input = [
    ['John', 'johnsmith@mail.com', 'john_newyork@mail.com'],
    ['John', 'johnsmith@mail.com', 'john00@mail.com'],
    ['Mary', 'mary@mail.com'],
    ['John', 'johnnybravo@mail.com'],
  ];
  const res = accountsMerge(input);
  assert.equal(res.length, 3);
  // John 应被合并成 2 个账户（一个含 3 邮箱，一个 johnnybravo 单独）
  const john = res.filter((r) => r[0] === 'John');
  assert.equal(john.length, 2);
  // 找到含 3 邮箱的 John
  const big = john.find((r) => r.length === 4);
  assert.ok(big);
  assert.deepEqual(big!.slice(1).sort(), [
    'john00@mail.com',
    'john_newyork@mail.com',
    'johnsmith@mail.com',
  ]);
});

test('accounts-merge 无共享邮箱', () => {
  const input = [
    ['A', 'a@x.com'],
    ['B', 'b@x.com'],
  ];
  assert.equal(accountsMerge(input).length, 2);
});

test('accounts-merge 全部共享', () => {
  const input = [
    ['A', 'a@x.com', 'b@x.com'],
    ['A', 'b@x.com', 'c@x.com'],
    ['A', 'c@x.com', 'd@x.com'],
  ];
  const res = accountsMerge(input);
  assert.equal(res.length, 1);
  assert.equal(res[0]!.length, 5); // name + 4 emails
});

test('accounts-merge 单账户', () => {
  const res = accountsMerge([['Solo', 's@x.com']]);
  assert.deepEqual(res, [['Solo', 's@x.com']]);
});
