import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  splitStringDesc,
  type SplitStringDescHooks,
} from '../../src/algorithms/greedy/split-string-desc/impl.ts';

/** 校验序列满足斐波那契性质（从第 3 项起每项 = 前两项和）。 */
function isFibonacciLike(seq: number[]): boolean {
  if (seq.length < 3) return false;
  for (let i = 2; i < seq.length; i++) {
    if (seq[i] !== seq[i - 1]! + seq[i - 2]!) return false;
  }
  return true;
}

/** 校验序列拼接等于原串。 */
function matchesString(seq: number[], s: string): boolean {
  return seq.map(String).join('') === s;
}

test('split-string-desc "11235813" 找到有效斐波那契拆分', () => {
  // LeetCode 示例 1：1,1,2,3,5,8,13 是经典解
  const r = splitStringDesc('11235813');
  assert.equal(r.found, true);
  assert.ok(isFibonacciLike(r.sequence), '应满足斐波那契性质');
  assert.ok(matchesString(r.sequence, '11235813'), '应拼接成原串');
});

test('split-string-desc "1101111" 找到有效拆分', () => {
  // LeetCode 示例 3：存在两种拆分 [11,0,11,11] 与 [110,1,111]，任一即可
  const r = splitStringDesc('1101111');
  assert.equal(r.found, true);
  assert.ok(isFibonacciLike(r.sequence), '应满足斐波那契性质');
  assert.ok(matchesString(r.sequence, '1101111'), '应拼接成原串');
});

test('split-string-desc "0000" = [0,0,0,0]', () => {
  // 0,0,0,0：0+0=0 ✓（每段就是 0，无前导零问题）
  const r = splitStringDesc('0000');
  assert.equal(r.found, true);
  assert.deepEqual(r.sequence, [0, 0, 0, 0]);
});

test('split-string-desc "123456" 无解', () => {
  // 暴力枚举确认无任何 >=3 段的斐波那契拆分
  const r = splitStringDesc('123456');
  assert.equal(r.found, false);
  assert.deepEqual(r.sequence, []);
});

test('split-string-desc "112358130" 无解', () => {
  // 8+13=21 而非 0；其它前两项也无解（暴力确认）
  const r = splitStringDesc('112358130');
  assert.equal(r.found, false);
  assert.deepEqual(r.sequence, []);
});

test('split-string-desc 找到的序列无前导零', () => {
  const r = splitStringDesc('11235813');
  assert.equal(r.found, true);
  for (const v of r.sequence) {
    const str = String(v);
    assert.ok(str.length === 1 || str[0] !== '0', '不应有前导零');
  }
});

test('split-string-desc 每段 <= 2^31 - 1', () => {
  const r = splitStringDesc('11235813');
  assert.equal(r.found, true);
  for (const v of r.sequence) {
    assert.ok(v >= 0 && v <= 2147483647, `段 ${v} 超出范围`);
  }
});

test('split-string-desc 钩子被调用', () => {
  let tries = 0;
  let concludes = 0;
  let generates = 0;
  const hooks: SplitStringDescHooks = {
    onTryFirstTwo: () => tries++,
    onGenerate: () => generates++,
    onConclude: () => concludes++,
  };
  splitStringDesc('11235813', hooks);
  assert.ok(tries > 0, 'onTryFirstTwo 应被调用');
  assert.ok(generates > 0, 'onGenerate 应被调用');
  assert.equal(concludes, 1, 'onConclude 应恰好调用一次');
});
