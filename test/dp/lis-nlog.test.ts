import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lisNlog } from '../../src/algorithms/dp/lis-nlog/impl.ts';

// 校验：sub 严格递增、长度正确、且确实是 a 的子序列（按下标）。
function check(a: number[], expectLen: number): void {
  const { length, sub } = lisNlog(a);
  assert.equal(length, expectLen, `${JSON.stringify(a)}: 长度期望 ${expectLen} 实得 ${length}`);
  assert.equal(sub.length, expectLen);
  for (let k = 1; k < sub.length; k++) assert.ok(sub[k]! > sub[k - 1]!, '应严格递增');
  // 是子序列
  let ptr = 0;
  for (let i = 0; i < a.length && ptr < sub.length; i++) {
    if (a[i] === sub[ptr]) ptr++;
  }
  assert.equal(ptr, sub.length, '应按序匹配原数组');
}

test('lis-nlog 基本行为', () => {
  assert.deepEqual(lisNlog([]), { length: 0, sub: [] });
  assert.deepEqual(lisNlog([1]), { length: 1, sub: [1] });
});

test('lis-nlog 经典用例', () => {
  check([10, 9, 2, 5, 3, 7, 101, 18], 4); // [2,3,7,101] 等
  check([0, 1, 0, 3, 2, 3], 4); // [0,1,2,3]
  check([7, 7, 7, 7], 1); // 严格递增 → 1
});

test('lis-nlog 与 O(n²) DP 对拍', () => {
  const dp = (a: number[]): number => {
    const f = a.map(() => 1);
    let best = a.length ? 1 : 0;
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < i; j++) {
        if (a[j]! < a[i]!) f[i] = Math.max(f[i]!, f[j]! + 1);
      }
      best = Math.max(best, f[i]!);
    }
    return best;
  };
  const rng = (s: number) => () => (s = (s * 1103515245 + 12345) & 0x7fffffff);
  const rand = rng(7);
  for (let t = 0; t < 300; t++) {
    const len = rand() % 20;
    const a: number[] = [];
    for (let i = 0; i < len; i++) a.push(rand() % 15);
    assert.equal(lisNlog(a).length, dp(a), `mismatch on ${JSON.stringify(a)}`);
  }
});

test('lis-nlog 钩子被调用', () => {
  let visit = 0;
  let place = 0;
  let done = -1;
  lisNlog([10, 9, 2, 5, 3, 7, 101, 18], {
    onVisit: () => visit++,
    onPlace: () => place++,
    onDone: (n) => {
      done = n;
    },
  });
  assert.equal(visit, 8);
  assert.equal(place, 8);
  assert.equal(done, 4);
});
