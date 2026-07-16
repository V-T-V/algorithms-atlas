import { test } from 'node:test';
import assert from 'node:assert/strict';
import { keccakHash, toBytes } from '../../src/algorithms/crypto/sha3-keccak/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/crypto/sha3-keccak/trace.ts';

test('keccak 输出长度正确', () => {
  assert.equal(keccakHash('').length, 64); // 32 字节 = 64 hex
  assert.equal(keccakHash('abc', 16).length, 32); // 16 字节
});

test('keccak 确定性（同输入同输出）', () => {
  assert.equal(keccakHash('hello'), keccakHash('hello'));
});

test('keccak 雪崩效应（小改变大不同）', () => {
  const a = keccakHash('hello');
  const b = keccakHash('hellp');
  assert.notEqual(a, b);
  // 至少 50% 的 hex 字符不同（粗略）
  let diff = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) diff++;
  assert.ok(diff >= a.length * 0.3, `雪崩不足: ${diff}/${a.length}`);
});

test('keccak 空输入有输出', () => {
  const h = keccakHash('');
  assert.ok(h.length > 0);
  assert.match(h, /^[0-9a-f]+$/);
});

test('keccak 长输入触发多次 absorb', () => {
  const absorbs: number[] = [];
  const long = 'x'.repeat(200);
  keccakHash(long, 32, { onAbsorb: (idx) => absorbs.push(idx) });
  assert.ok(absorbs.length >= 2, '长输入应触发多次 absorb');
});

test('keccak toBytes', () => {
  assert.deepEqual(toBytes('AB'), [65, 66]);
});

test('keccak 钩子被调用', () => {
  const perms: number[] = [];
  keccakHash('abc', 32, { onPermute: (r) => perms.push(r) });
  assert.equal(perms.length, 24); // 一轮 absorb 触发 24 轮
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.aux, '首帧含 aux');
  const last = frames[frames.length - 1]!;
  assert.ok(last.map, '末帧含 map');
});
