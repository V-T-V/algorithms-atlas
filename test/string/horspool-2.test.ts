import { test } from 'node:test';
import assert from 'node:assert/strict';
import { horspool2, buildShiftTable } from '../../src/algorithms/string/horspool-2/impl.ts';

test('horspool2 基本匹配', () => {
  assert.deepEqual(horspool2('AABAACAADAABAABA', 'AABA'), [0, 9, 12]);
  assert.deepEqual(horspool2('ABCDEF', 'CD'), [2]);
  assert.deepEqual(horspool2('HELLO', 'XYZ'), []);
  assert.deepEqual(horspool2('', 'A'), []);
});

test('buildShiftTable 末位字符排除', () => {
  const t = buildShiftTable('ABAC');
  // m=4; A 出现在 0,2(最后 2) -> 4-1-2=1; B 在 1 -> 4-1-1=2; C 在末位不参与
  assert.equal(t['A'.charCodeAt(0)], 1);
  assert.equal(t['B'.charCodeAt(0)], 2);
  assert.equal(t['C'.charCodeAt(0)], 4); // 末位不参与
  assert.equal(t['Z'.charCodeAt(0)], 4); // 未出现
});

test('horspool2 钩子被调用', () => {
  let compares = 0;
  let founds = 0;
  horspool2('AABAACAADAABAABA', 'AABA', {
    onCompare: () => compares++,
    onFound: () => founds++,
  });
  assert.ok(compares > 0);
  assert.equal(founds, 3);
});
