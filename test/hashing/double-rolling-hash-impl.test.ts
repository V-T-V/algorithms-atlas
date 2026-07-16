import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  DoubleRollingHash,
  doubleSubstringsEqual,
  naiveSubstringsEqual,
  PARAMS,
} from '../../src/algorithms/hashing/double-rolling-hash-impl/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/hashing/double-rolling-hash-impl/trace.ts';

test('DoubleRollingHash 子串哈希确定性', () => {
  const dh = new DoubleRollingHash('abcdef');
  const a = dh.hashOf(0, 3);
  const b = dh.hashOf(0, 3);
  assert.equal(a.h1, b.h1);
  assert.equal(a.h2, b.h2);
});

test('DoubleRollingHash 相同子串双哈希都相等', () => {
  const dh = new DoubleRollingHash('abcabc');
  const a = dh.hashOf(0, 3);
  const b = dh.hashOf(3, 6);
  assert.equal(a.h1, b.h1);
  assert.equal(a.h2, b.h2);
});

test('DoubleRollingHash 不同子串至少一个哈希不同', () => {
  const dh = new DoubleRollingHash('abcdef');
  const a = dh.hashOf(0, 3);
  const b = dh.hashOf(1, 4);
  assert.ok(a.h1 !== b.h1 || a.h2 !== b.h2);
});

test('DoubleRollingHash 哈希在各自模范围内', () => {
  const dh = new DoubleRollingHash('The quick brown fox');
  const q = dh.hashOf(0, 10);
  assert.ok(q.h1 >= 0 && q.h1 < PARAMS.prime1);
  assert.ok(q.h2 >= 0 && q.h2 < PARAMS.prime2);
});

test('DoubleRollingHash 非法区间抛错', () => {
  const dh = new DoubleRollingHash('abc');
  assert.throws(() => dh.hashOf(-1, 2));
  assert.throws(() => dh.hashOf(2, 2));
  assert.throws(() => dh.hashOf(0, 5));
});

test('doubleSubstringsEqual 真子串相等', () => {
  assert.equal(doubleSubstringsEqual('abcabc', 0, 3, 'abcabc', 3, 6), true);
  assert.equal(doubleSubstringsEqual('hello', 0, 2, 'world', 0, 2), false);
  assert.equal(doubleSubstringsEqual('test', 1, 4, 'best', 1, 4), true);
});

test('doubleSubstringsEqual 长度不同返回 false', () => {
  assert.equal(doubleSubstringsEqual('abc', 0, 2, 'abc', 0, 3), false);
});

test('doubleSubstringsEqual 与朴素比较一致（随机）', () => {
  const alpha = 'ab';
  let text = '';
  for (let i = 0; i < 100; i++) text += alpha[Math.floor(Math.random() * 2)];
  for (const [la, len] of [
    [0, 1],
    [5, 3],
    [10, 5],
    [50, 2],
  ] as const) {
    const ra = la + len;
    for (const [lb, len2] of [
      [3, 1],
      [7, 3],
      [12, 5],
      [60, 2],
    ] as const) {
      const rb = lb + len2;
      const expected = naiveSubstringsEqual(text, la, ra, text, lb, rb);
      const got = doubleSubstringsEqual(text, la, ra, text, lb, rb);
      assert.equal(got, expected);
    }
  }
});

test('DoubleRollingHash 钩子：onQuery 触发', () => {
  const dh = new DoubleRollingHash('abcdef');
  let queries = 0;
  dh.hashOf(0, 3, { onQuery: () => queries++ });
  dh.hashOf(1, 4, { onQuery: () => queries++ });
  assert.equal(queries, 2);
});

test('DoubleRollingHash 字节数组输入', () => {
  const dh = new DoubleRollingHash([97, 98, 99]); // 'abc'
  const q = dh.hashOf(0, 3);
  assert.ok(q.h1 >= 0 && q.h2 >= 0);
});

test('fullHash 等于 hashOf(0,n)', () => {
  const dh = new DoubleRollingHash('hello');
  const f = dh.fullHash();
  const h = dh.hashOf(0, 5);
  assert.equal(f.h1, h.h1);
  assert.equal(f.h2, h.h2);
});

test('buildTrace 含 array 与 aux，末帧含不同组数', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.array, '首帧含 array');
  const last = frames[frames.length - 1]!;
  const c = last.aux!.find((e) => e.label === '不同组数');
  assert.ok(c, '末帧应含不同组数');
});
