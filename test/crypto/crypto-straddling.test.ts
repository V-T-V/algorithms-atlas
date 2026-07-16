import { test } from 'node:test';
import assert from 'node:assert/strict';
import { straddlingEncrypt } from '../../src/algorithms/crypto/crypto-straddling/impl.ts';

test('crypto-straddling 常用字母一位码', () => {
  // E=0 S=1 T=2 O=3 N=4 I=5 A=6 R=7
  assert.equal(straddlingEncrypt('E'), '0');
  assert.equal(straddlingEncrypt('T'), '2');
  assert.equal(straddlingEncrypt('A'), '6');
});

test('crypto-straddling 次常用字母两位码前缀8', () => {
  // B=80 C=81 D=82 F=83 G=84 H=85 K=86 L=87
  assert.equal(straddlingEncrypt('H'), '85');
  assert.equal(straddlingEncrypt('L'), '87');
});

test('crypto-straddling 稀有字母两位码前缀9', () => {
  // J=90 M=91 P=92 Q=93 U=94 V=95 W=96 X=97 Y=98 Z=99
  assert.equal(straddlingEncrypt('Z'), '99');
  assert.equal(straddlingEncrypt('M'), '91');
});

test('crypto-straddling 非字母忽略', () => {
  assert.equal(straddlingEncrypt('E!'), '0');
});
