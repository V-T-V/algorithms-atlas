import { test } from 'node:test';
import assert from 'node:assert/strict';
import { atbashExtended } from '../../src/algorithms/crypto/crypto-atbash-extended/impl.ts';

test('crypto-atbash-extended 自反', () => {
  const s = 'Hello Z3!';
  assert.equal(atbashExtended(atbashExtended(s)), s);
});

test('crypto-atbash-extended 字母镜像', () => {
  // 大小写分别镜像：A->Z B->Y C->X；x->c y->b z->a
  assert.equal(atbashExtended('ABCxyz'), 'ZYXcba');
});

test('crypto-atbash-extended 数字反转', () => {
  assert.equal(atbashExtended('01289'), '98710');
});
