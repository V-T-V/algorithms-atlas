import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CountingBloomFilter } from '../../src/algorithms/hashing/counting-bloom-impl/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/hashing/counting-bloom-impl/trace.ts';

test('CountingBloom 插入后查询命中（无假阴性）', () => {
  const cbf = new CountingBloomFilter(32, 3);
  cbf.add('hello');
  cbf.add('world');
  assert.equal(cbf.contains('hello'), true);
  assert.equal(cbf.contains('world'), true);
});

test('CountingBloom 未插入元素返回 false（一定不在）', () => {
  const cbf = new CountingBloomFilter(64, 4);
  cbf.add('apple');
  // 'zebra' 未插入，大概率（不绝对）返回 false
  assert.equal(cbf.contains('zebra'), false);
});

test('CountingBloom slotOf 在 [0, size)', () => {
  const cbf = new CountingBloomFilter(16, 3);
  for (const key of ['a', 'b', 'test', 'hello']) {
    for (let i = 0; i < 3; i++) {
      const s = cbf.slotOf(key, i);
      assert.ok(s >= 0 && s < 16, `slot=${s}`);
    }
  }
});

test('CountingBloom slotOf 确定性', () => {
  const cbf = new CountingBloomFilter(16, 3);
  for (let i = 0; i < 3; i++) {
    assert.equal(cbf.slotOf('key', i), cbf.slotOf('key', i));
  }
});

test('CountingBloom 删除后元素不再被报告为存在', () => {
  const cbf = new CountingBloomFilter(64, 3);
  cbf.add('solo');
  assert.equal(cbf.contains('solo'), true);
  cbf.remove('solo');
  // 独占键删除后计数清零，应返回 false
  assert.equal(cbf.contains('solo'), false);
});

test('CountingBloom 重复插入递增计数', () => {
  const cbf = new CountingBloomFilter(32, 2);
  cbf.add('x');
  cbf.add('x');
  cbf.add('x');
  const total = cbf.totalCount();
  assert.equal(total, 6); // 3 次 × 2 哈希 = 6
});

test('CountingBloom 计数器上限保护（防溢出）', () => {
  const cbf = new CountingBloomFilter(8, 1, 4); // maxCount = 15
  for (let i = 0; i < 100; i++) cbf.add('overflow');
  // 任一计数器不应超过 maxCount=15
  for (const c of cbf.counters) assert.ok(c <= 15, `count=${c} 超过上限`);
});

test('CountingBloom countNonZero 与 totalCount 正确', () => {
  const cbf = new CountingBloomFilter(32, 2);
  cbf.add('a');
  cbf.add('b');
  assert.ok(cbf.countNonZero() > 0);
  assert.ok(cbf.totalCount() >= 2);
});

test('CountingBloom 非法参数抛错', () => {
  assert.throws(() => new CountingBloomFilter(0, 3));
  assert.throws(() => new CountingBloomFilter(16, 0));
  assert.throws(() => new CountingBloomFilter(16, 3, 0));
});

test('CountingBloom add 后 remove 回到全 0（单键）', () => {
  const cbf = new CountingBloomFilter(32, 2);
  cbf.add('reversible');
  cbf.remove('reversible');
  assert.equal(cbf.totalCount(), 0);
  assert.equal(cbf.countNonZero(), 0);
});

test('CountingBloom 钩子：onIncrement 与 onDecrement 触发', () => {
  const cbf = new CountingBloomFilter(16, 2);
  let inc = 0;
  let dec = 0;
  cbf.add('k', { onIncrement: () => inc++ });
  cbf.remove('k', { onDecrement: () => dec++ });
  assert.equal(inc, 2);
  assert.equal(dec, 2);
});

test('CountingBloom 钩子：contains onResult', () => {
  const cbf = new CountingBloomFilter(16, 2);
  let result: number | boolean = true;
  cbf.add('present');
  cbf.contains('present', { onResult: (_k, _op, v) => (result = v) });
  assert.equal(result, true);
  cbf.contains('absent', { onResult: (_k, _op, v) => (result = v) });
  assert.equal(result, false);
});

test('CountingBloom 多元素共享计数器删除不影响其他', () => {
  const cbf = new CountingBloomFilter(64, 3);
  cbf.add('a');
  cbf.add('b');
  cbf.add('c');
  cbf.remove('b');
  // a 和 c 仍应被报告存在
  assert.equal(cbf.contains('a'), true);
  assert.equal(cbf.contains('c'), true);
});

test('buildTrace 含 array 与 aux，末帧含非零槽', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.array, '首帧含 array');
  const last = frames[frames.length - 1]!;
  const c = last.aux!.find((e) => e.label === '非零槽');
  assert.ok(c, '末帧应含非零槽');
});
