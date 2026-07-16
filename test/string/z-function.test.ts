import { test } from 'node:test';
import assert from 'node:assert/strict';
import { zFunction } from '../../src/algorithms/string/z-function/impl.ts';

/** 朴素 O(n^2) Z 函数，用于对照（z[0]=0 约定）。 */
function naiveZ(s: string): number[] {
  const n = s.length;
  const z = new Array<number>(n).fill(0);
  for (let i = 1; i < n; i++) {
    let k = 0;
    while (k + i < n && s[k] === s[i + k]) k++;
    z[i] = k;
  }
  return z;
}

test('z-function 基本行为', () => {
  assert.deepEqual(zFunction(''), []);
  assert.deepEqual(zFunction('a'), [0]);
  assert.deepEqual(zFunction('aaaaa'), [0, 4, 3, 2, 1]);
  assert.deepEqual(zFunction('abcde'), [0, 0, 0, 0, 0]);
});

test('z-function 经典用例', () => {
  // "aabxaabxcaabxaabxay" 是 CP-Algorithms 风格用例
  const s = 'aabxaabxcaabxaabxay';
  const z = zFunction(s);
  assert.equal(z[0], 0);
  // 整体对照朴素（z[1..] 不手算，靠 naive 验证）
  assert.deepEqual(z, naiveZ(s));
});

test('z-function 与朴素一致（随机串）', () => {
  const s = 'abcababcabcaabcabcab';
  assert.deepEqual(zFunction(s), naiveZ(s));
});

test('z-function 全相同字符', () => {
  assert.deepEqual(zFunction('zzzzz'), [0, 4, 3, 2, 1]);
});

test('z-function 钩子被调用', () => {
  let compare = 0;
  let setZ = 0;
  zFunction('aaaaa', {
    onCompare: () => compare++,
    onSetZ: () => setZ++,
  });
  assert.ok(setZ >= 5, '每个位置都应 onSetZ');
  assert.ok(compare > 0, '应发生字符比较');
});

test('z-function 长度正确', () => {
  const s = 'mississippi';
  assert.equal(zFunction(s).length, s.length);
});
