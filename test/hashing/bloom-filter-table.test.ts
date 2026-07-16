import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BloomFilter, bloomFilter } from '../../src/algorithms/hashing/bloom-filter-table/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/bloom-filter-table/trace.ts';

test('bloom-filter 插入后必能查到（无假阴性）', () => {
  const bf = bloomFilter(['apple', 'banana', 'cherry'], 64, 4);
  assert.equal(bf.contains('apple'), true);
  assert.equal(bf.contains('banana'), true);
  assert.equal(bf.contains('cherry'), true);
});

test('bloom-filter 未插入的常见项应查不到（真阴性）', () => {
  const bf = bloomFilter(['apple', 'banana'], 128, 5);
  // 大量查询，未插入的项绝大多数应返回 false
  const notInserted = ['zzz', 'qwerty', 'no-such-fruit-12345', '__missing__'];
  for (const k of notInserted) {
    assert.equal(bf.contains(k), false, `${k} 不应在集合中`);
  }
});

test('bloom-filter 无假阴性（同一对象插入后再查必为真）', () => {
  const bf = new BloomFilter(32, 3);
  for (const k of ['a', 'b', 'c', 'd', 'e']) bf.add(k);
  for (const k of ['a', 'b', 'c', 'd', 'e']) {
    assert.equal(bf.contains(k), true, `已插入 ${k} 必为真`);
  }
});

test('bloom-filter 确定性：相同输入相同位图', () => {
  const bf1 = bloomFilter(['x', 'y', 'z'], 32, 3);
  const bf2 = bloomFilter(['x', 'y', 'z'], 32, 3);
  assert.deepEqual(bf1.bits, bf2.bits);
});

test('bloom-filter add 后置位数 <= k * 元素数', () => {
  const bf = bloomFilter(['only-one'], 64, 4);
  // 一个元素最多置 k=4 位（可能有重叠）
  assert.ok(bf.countSetBits() <= 4);
  assert.ok(bf.countSetBits() >= 1);
});

test('bloom-filter 多元素置位数单调增长', () => {
  const bf = new BloomFilter(256, 5);
  const c0 = bf.countSetBits();
  bf.add('a');
  const c1 = bf.countSetBits();
  bf.add('b');
  const c2 = bf.countSetBits();
  assert.ok(c1 >= c0);
  assert.ok(c2 >= c1);
});

test('bloom-filter bitOf 在范围内且确定性', () => {
  const bf = new BloomFilter(64, 4);
  for (const k of ['a', 'foo', 'bar']) {
    for (let i = 0; i < 4; i++) {
      const b = bf.bitOf(k, i);
      assert.ok(b >= 0 && b < 64);
      assert.equal(b, bf.bitOf(k, i)); // 确定性
    }
  }
});

test('bloom-filter k 个哈希位一般不全部相同', () => {
  const bf = new BloomFilter(128, 5);
  const bits = new Set<number>();
  for (let i = 0; i < 5; i++) bits.add(bf.bitOf('hello', i));
  // k=5 时至少应有 >1 个不同位（哈希分散）
  assert.ok(bits.size > 1, '哈希位应分散');
});

test('bloom-filter 参数校验', () => {
  assert.throws(() => new BloomFilter(0, 3));
  assert.throws(() => new BloomFilter(32, 0));
  assert.throws(() => new BloomFilter(-1, 3));
});

test('bloom-filter 估计假阳性率随 m 增大下降', () => {
  const bfSmall = new BloomFilter(32, 3);
  const bfLarge = new BloomFilter(1024, 3);
  const n = 10;
  assert.ok(bfLarge.estimatedFpRate(n) < bfSmall.estimatedFpRate(n));
});

test('bloom-filter 钩子被调用', () => {
  let sets = 0;
  let checks = 0;
  let results = 0;
  const bf = new BloomFilter(64, 3);
  bf.add('foo', {
    onSet: () => sets++,
  });
  assert.equal(sets, 3);
  bf.contains('foo', {
    onCheck: () => checks++,
    onResult: () => results++,
  });
  assert.equal(checks, 3);
  assert.equal(results, 1);
});

test('buildTrace 生成 array 帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 4);
  for (const f of frames) assert.ok(f.array, '每帧应有 array');
  const last = frames[frames.length - 1]!;
  assert.ok(
    last.array!.values.every((v) => v === 0 || v === 1),
    '位值应 0/1',
  );
});
