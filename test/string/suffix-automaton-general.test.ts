import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildGeneralSAM,
  GeneralSAM,
} from '../../src/algorithms/string/suffix-automaton-general/impl.ts';

test('GSAM 子串判定（单串退化为 SAM）', () => {
  const sam = buildGeneralSAM(['abcbc']);
  assert.equal(sam.contains('abc'), true);
  assert.equal(sam.contains('bcb'), true);
  assert.equal(sam.contains('cbc'), true);
  assert.equal(sam.contains('abcbc'), true);
  assert.equal(sam.contains('abx'), false);
  assert.equal(sam.contains('cba'), false);
});

test('GSAM 多串共享', () => {
  const sam = buildGeneralSAM(['abcbc', 'bcab']);
  // 来自第一个
  assert.equal(sam.contains('bcb'), true);
  // 来自第二个
  assert.equal(sam.contains('bca'), true);
  assert.equal(sam.contains('cab'), true);
  // 都没有
  assert.equal(sam.contains('xyz'), false);
});

test('GSAM 空串包含', () => {
  const sam = buildGeneralSAM(['abc']);
  assert.equal(sam.contains(''), true);
});

test('GSAM addString 增量', () => {
  const sam = new GeneralSAM();
  sam.addString('hello');
  assert.equal(sam.contains('ell'), true);
  assert.equal(sam.contains('world'), false);
  sam.addString('world');
  assert.equal(sam.contains('world'), true);
  assert.equal(sam.contains('ell'), true);
});

test('GSAM 状态数为线性', () => {
  const sam = buildGeneralSAM(['a'.repeat(50)]);
  // 单串 SAM 状态数 <= 2n-1
  assert.ok(sam.states.length <= 100);
});
