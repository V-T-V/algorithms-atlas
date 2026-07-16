import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  add,
  lookup,
  remove,
  createFilter,
  buildFilter,
  fingerprint,
  altIndex,
  hashStr,
  type Rng,
} from '../../src/algorithms/hashing/cuckoo-filter/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
  DEFAULT_BUCKETS,
} from '../../src/algorithms/hashing/cuckoo-filter/trace.ts';

// 确定性 RNG
function makeRng(seed: number): Rng {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1103515245) + 12345) >>> 0;
    return s / 0x100000000;
  };
}

test('cuckoo-filter 插入后查询命中（无假阴性）', () => {
  const rng = makeRng(1);
  const filter = createFilter(16);
  const items = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  for (const it of items) add(filter, it, {}, rng);
  for (const it of items) {
    assert.equal(lookup(filter, it), true, `已插入的 "${it}" 应命中`);
  }
});

test('cuckoo-filter 删除后再查询不命中', () => {
  const rng = makeRng(2);
  const filter = createFilter(16);
  add(filter, 'hello', {}, rng);
  assert.equal(lookup(filter, 'hello'), true);
  assert.equal(remove(filter, 'hello'), true);
  assert.equal(lookup(filter, 'hello'), false);
});

test('cuckoo-filter altIndex 满足 i2 = altIndex(i1, fp)，且 i1 = altIndex(i2, fp)', () => {
  const numBuckets = 16;
  for (const item of ['x', 'y', 'z', 'apple', 'test']) {
    const fp = fingerprint(item);
    const i1 = hashStr(item) % numBuckets;
    const i2 = altIndex(i1, fp, numBuckets);
    const back = altIndex(i2, fp, numBuckets);
    assert.equal(back, i1, `altIndex 不自反：item=${item} i1=${i1} i2=${i2} back=${back}`);
  }
});

test('cuckoo-filter 指纹非零 ∈ [1, 256)', () => {
  for (const item of ['', 'a', 'ab', 'test', '布谷鸟']) {
    const fp = fingerprint(item);
    assert.ok(fp >= 1 && fp < 256, `指纹 ${fp} 越界`);
  }
});

test('cuckoo-filter 假阳性率合理（插入 N 个，查询 1000 个未见元素）', () => {
  const rng = makeRng(7);
  const filter = createFilter(64);
  const inserted = new Set<string>();
  for (let i = 0; i < 40; i++) {
    const s = `item${i}`;
    add(filter, s, {}, rng);
    inserted.add(s);
  }
  let falsePositives = 0;
  for (let i = 1000; i < 2000; i++) {
    const s = `notinserted${i}`;
    if (lookup(filter, s)) falsePositives++;
  }
  // 假阳性率应远低于 50%
  assert.ok(falsePositives < 500, `假阳性过多：${falsePositives}`);
});

test('cuckoo-filter 钩子：插入触发 onIndex 与 onInsert', () => {
  const rng = makeRng(3);
  const indices: string[] = [];
  const inserts: number[] = [];
  const filter = createFilter(16);
  add(
    filter,
    'apple',
    {
      onIndex: (item) => indices.push(item),
      onInsert: (bucket) => inserts.push(bucket),
    },
    rng,
  );
  assert.deepEqual(indices, ['apple']);
  assert.equal(inserts.length, 1);
});

test('cuckoo-filter buildFilter 返回失败列表', () => {
  const rng = makeRng(4);
  const { filter, failed } = buildFilter(['a', 'b', 'c'], 8, {}, rng);
  assert.ok(Array.isArray(failed));
  assert.equal(filter.count + failed.length, 3);
});

test('cuckoo-filter 空输入', () => {
  const filter = createFilter(8);
  assert.equal(filter.count, 0);
  assert.equal(lookup(filter, 'anything'), false);
});

test('cuckoo-filter 删除不存在的元素返回 false', () => {
  const filter = createFilter(8);
  assert.equal(remove(filter, 'nope'), false);
});

test('cuckoo-filter hashStr 确定性', () => {
  assert.equal(hashStr('abc'), hashStr('abc'));
  assert.notEqual(hashStr('abc'), hashStr('abd'));
});

test('buildTrace 含 array2d（grid），末帧含已存元素', () => {
  const frames = buildTrace(DEFAULT_INPUT, DEFAULT_BUCKETS);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.array2d, '首帧含 array2d');
  const last = frames[frames.length - 1]!;
  const ins = last.aux!.find((e) => e.label === '已存元素');
  assert.ok(ins, '末帧应含已存元素');
});
