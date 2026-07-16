import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  reorganizeString,
  type ReorganizeStringHooks,
} from '../../src/algorithms/greedy/reorganize-string/impl.ts';

test('reorganize-string "aab" 可行', () => {
  const r = reorganizeString('aab');
  assert.equal(r.possible, true);
  assert.equal(r.value, 'aba');
});

test('reorganize-string "aaab" 不可行', () => {
  // a 出现 3 次 > ceil(4/2)=2
  const r = reorganizeString('aaab');
  assert.equal(r.possible, false);
  assert.equal(r.value, '');
});

test('reorganize-string 结果相邻字符不同', () => {
  const cases = ['aab', 'aaabbc', 'vvvlo', 'aabbcc'];
  for (const s of cases) {
    const r = reorganizeString(s);
    if (r.possible) {
      for (let i = 1; i < r.value.length; i++) {
        assert.notEqual(r.value[i], r.value[i - 1], `位置 ${i} 相邻相同`);
      }
      // 字符多重集应相同
      const a = [...s].sort().join('');
      const b = [...r.value].sort().join('');
      assert.equal(a, b, '应包含相同字符集');
    }
  }
});

test('reorganize-string 单字符', () => {
  assert.equal(reorganizeString('a').value, 'a');
});

test('reorganize-string 空串', () => {
  const r = reorganizeString('');
  assert.equal(r.possible, true);
  assert.equal(r.value, '');
});

test('reorganize-string 全相同不可行', () => {
  assert.equal(reorganizeString('aaaa').possible, false);
});

test('reorganize-string "baaba" 可行（字符集正确）', () => {
  const r = reorganizeString('baaba');
  assert.equal(r.possible, true);
  assert.equal([...r.value].sort().join(''), [...'baaba'].sort().join(''));
});

test('reorganize-string 钩子被调用', () => {
  let counts = 0;
  let places = 0;
  const hooks: ReorganizeStringHooks = {
    onCount: () => counts++,
    onPlace: () => places++,
  };
  reorganizeString('aab', hooks);
  assert.equal(counts, 1);
  assert.ok(places > 0);
});
