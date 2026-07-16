import { test } from 'node:test';
import assert from 'node:assert/strict';
import { galil } from '../../src/algorithms/string/galil/impl.ts';

const naiveMatch = (text: string, pat: string): number[] => {
  const res: number[] = [];
  for (let i = 0; i <= text.length - pat.length; i++) {
    if (text.slice(i, i + pat.length) === pat) res.push(i);
  }
  return res;
};

test('galil 基本匹配', () => {
  assert.deepEqual(galil('AABAACAADAABAABA', 'AABA'), [0, 9, 12]);
  assert.deepEqual(galil('ABCDEF', 'CD'), [2]);
  assert.deepEqual(galil('HELLO', 'XYZ'), []);
});

test('galil 周期性模式（重叠）', () => {
  assert.deepEqual(galil('AAAAA', 'AA'), [0, 1, 2, 3]);
  assert.deepEqual(galil('abababab', 'abab'), [0, 2, 4]);
  assert.deepEqual(galil('abcabcabc', 'abcabc'), [0, 3]);
});

test('galil 与朴素一致', () => {
  const cases: Array<[string, string]> = [
    ['aaaaaaaaaa', 'aaa'],
    ['abcabcabcabc', 'bca'],
    ['mississippi', 'issi'],
    ['xyzxyzxyz', 'xyzx'],
  ];
  for (const [text, pat] of cases) {
    assert.deepEqual(galil(text, pat), naiveMatch(text, pat), `${text} / ${pat}`);
  }
});

test('galil 边界', () => {
  assert.deepEqual(galil('', 'A'), []);
  assert.deepEqual(galil('A', 'A'), [0]);
  assert.deepEqual(galil('ABC', ''), []);
});

test('galil 钩子被调用', () => {
  let founds = 0;
  galil('AABAACAADAABAABA', 'AABA', {
    onFound: () => founds++,
  });
  assert.equal(founds, 3);
});
