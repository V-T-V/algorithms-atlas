import { test } from 'node:test';
import assert from 'node:assert/strict';
import { digitDp } from '../../src/algorithms/dp/digit-dp/impl.ts';

/** 暴力校验：[1,n] 中不含 d 的整数个数。 */
function brute(n: number, d: number): number {
  let c = 0;
  const ds = String(d);
  for (let i = 1; i <= n; i++) if (!String(i).includes(ds)) c++;
  return c;
}

test('digit-dp 经典用例（n=20, d=0）', () => {
  // [1,20] 不含 0：1-9, 11-19 共 18 个
  assert.equal(digitDp({ n: 20, digit: 0 }), 18);
});

test('digit-dp 与暴力一致', () => {
  for (const n of [5, 20, 100, 255, 1000, 9999]) {
    assert.equal(digitDp({ n, digit: 4 }), brute(n, 4), `n=${n}, d=4 不一致`);
  }
});

test('digit-dp 排除 0 的情形与暴力一致', () => {
  for (const n of [50, 300, 1000]) {
    assert.equal(digitDp({ n, digit: 0 }), brute(n, 0), `n=${n}, d=0 不一致`);
  }
});

test('digit-dp 边界', () => {
  assert.equal(digitDp({ n: 0, digit: 3 }), 0);
  assert.equal(digitDp({ n: 1, digit: 9 }), 1); // [1,1] 不含 9
  assert.equal(digitDp({ n: 9, digit: 9 }), 8); // [1,9] 去掉 9 = 8
});

test('digit-dp 前缀相减还原区间', () => {
  // [10, 50] 不含 4 的个数 = solve(50) - solve(9)
  const range = digitDp({ n: 50, digit: 4 }) - digitDp({ n: 9, digit: 4 });
  let expected = 0;
  for (let i = 10; i <= 50; i++) if (!String(i).includes('4')) expected++;
  assert.equal(range, expected);
});

test('digit-dp 钩子被调用', () => {
  let enters = 0;
  let choices = 0;
  let doneAns = -1;
  digitDp(
    { n: 100, digit: 4 },
    {
      onEnterState: () => enters++,
      onChooseDigit: () => choices++,
      onDone: (ans) => {
        doneAns = ans;
      },
    },
  );
  assert.ok(enters >= 1, '至少进入一次状态');
  assert.ok(choices >= 1, '至少做了一次数字选择');
  assert.equal(doneAns, brute(100, 4));
});
