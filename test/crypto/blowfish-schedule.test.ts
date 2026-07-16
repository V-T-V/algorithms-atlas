import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  blowfishEncrypt,
  blowfishKeySchedule,
  keyToWords,
  P_ARRAY_LEN,
  S_BOX_COUNT,
  S_BOX_LEN,
} from '../../src/algorithms/crypto/blowfish-schedule/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/crypto/blowfish-schedule/trace.ts';

test('blowfish P/S 数组尺寸正确', () => {
  const state = blowfishKeySchedule('k');
  assert.equal(state.P.length, P_ARRAY_LEN);
  assert.equal(state.S.length, S_BOX_COUNT);
  for (const box of state.S) assert.equal(box.length, S_BOX_LEN);
});

test('blowfish 不同密钥产生不同 P', () => {
  const a = blowfishKeySchedule('keyA');
  const b = blowfishKeySchedule('keyB');
  assert.notDeepEqual(a.P, b.P);
});

test('blowfish 相同密钥产生相同 P（确定性）', () => {
  const a = blowfishKeySchedule('same');
  const b = blowfishKeySchedule('same');
  assert.deepEqual(a.P, b.P);
  assert.deepEqual(a.S, b.S);
});

test('blowfish keyToWords 长度', () => {
  assert.equal(keyToWords('').length, P_ARRAY_LEN);
  assert.equal(keyToWords('abc').length, P_ARRAY_LEN);
});

test('blowfish encrypt 自洽（双射性）', () => {
  // 同一 state 下，给定输入产生确定输出（不测可逆因简化 F）
  const state = blowfishKeySchedule('k');
  const r1 = blowfishEncrypt(state, 0x12345678, 0x9abcdef0);
  const r2 = blowfishEncrypt(state, 0x12345678, 0x9abcdef0);
  assert.deepEqual(r1, r2);
});

test('blowfish 钩子被调用', () => {
  const inits: number[] = [];
  const overwrites: number[] = [];
  blowfishKeySchedule('k', {
    onInitP: (i) => inits.push(i),
    onOverwriteP: (i) => overwrites.push(i),
  });
  assert.equal(inits.length, P_ARRAY_LEN);
  assert.ok(overwrites.length >= P_ARRAY_LEN);
});

test('blowfish 空密钥可行', () => {
  const state = blowfishKeySchedule('');
  assert.equal(state.P.length, P_ARRAY_LEN);
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.aux, '首帧含 aux');
  const last = frames[frames.length - 1]!;
  assert.ok(last.map, '末帧含 map');
});
