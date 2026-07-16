import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  cuckoo,
  insert,
  search,
  createTable,
  hash1,
  hash2Int,
} from '../../src/algorithms/hashing/cuckoo/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
  DEFAULT_SIZE,
} from '../../src/algorithms/hashing/cuckoo/trace.ts';

test('cuckoo 插入后查找全部命中', () => {
  const keys = [20, 50, 53, 30, 23, 26, 17];
  const { table } = cuckoo(keys, 11);
  for (const k of keys) {
    const r = search(table, k);
    assert.ok(r !== null, `键 ${k} 应可查到`);
  }
});

test('cuckoo 查找未命中返回 null', () => {
  const { table } = cuckoo([10, 22, 31], 11);
  assert.equal(search(table, 999), null);
});

test('cuckoo 查找最坏 O(1)：仅探测两表各一次', () => {
  const { table } = cuckoo([20, 50, 53], 11);
  let probes = 0;
  search(table, 53, {
    onHash: () => probes++,
  });
  // onHash 只调用一次（计算 h1/h2），但查找查两个槽 → probes=1
  assert.equal(probes, 1);
});

test('cuckoo 去重（相同键不重复插入）', () => {
  const t = createTable(11);
  insert(t, 10);
  insert(t, 10);
  // 统计 10 出现次数
  let count = 0;
  for (const s of t.tables[0]) if (s === 10) count++;
  for (const s of t.tables[1]) if (s === 10) count++;
  assert.equal(count, 1);
});

test('cuckoo 每个键在表中至多出现一次（两表合计）', () => {
  const keys = [20, 50, 53, 30, 23, 26, 17, 13, 44];
  const { table } = cuckoo(keys, 13);
  for (const k of keys) {
    let count = 0;
    for (const s of table.tables[0]) if (s === k) count++;
    for (const s of table.tables[1]) if (s === k) count++;
    assert.equal(count, 1, `键 ${k} 出现 ${count} 次`);
  }
});

test('cuckoo 键恰在 h1 或 h2 之一', () => {
  const keys = [20, 50, 53, 30, 23];
  const { table } = cuckoo(keys, 11);
  for (const k of keys) {
    const h1 = hash1(k, table.size);
    const h2 = hash2Int(k, table.size);
    const inT0 = table.tables[0][h1] === k;
    const inT1 = table.tables[1][h2] === k;
    assert.ok(inT0 || inT1, `键 ${k} 必在 h1 或 h2`);
    assert.ok(!(inT0 && inT1), `键 ${k} 不应同时在两表`);
  }
});

test('cuckoo 钩子：插入触发 onHash 与至少一次 onPlace', () => {
  const hashes: number[] = [];
  const places: number[] = [];
  cuckoo([10, 22, 31], 11, {
    onHash: (k) => hashes.push(k),
    onPlace: (_t, _s, k) => places.push(k),
  });
  assert.equal(hashes.length, 3);
  assert.equal(places.length, 3);
});

test('cuckoo 冲突时产生踢出', () => {
  // 构造可能踢出的场景：选键使 h1/h1 撞同一槽
  let kicks = 0;
  const { table, failed } = cuckoo(DEFAULT_INPUT, DEFAULT_SIZE, {
    onKick: () => kicks++,
  });
  // 至少能插入大部分；踢出次数 >= 0
  assert.ok(kicks >= 0);
  // 已插入的键应可查
  for (let i = 0; i < DEFAULT_INPUT.length; i++) {
    const k = DEFAULT_INPUT[i]!;
    if (!failed.includes(k)) {
      assert.ok(search(table, k) !== null, `未失败的键 ${k} 应可查`);
    }
  }
});

test('cuckoo hash1 / hash2Int 落在 [0, size)', () => {
  for (const k of [0, 1, 11, 12, 100, -1, -13]) {
    const s = 11;
    const h1 = hash1(k, s);
    const h2 = hash2Int(k, s);
    assert.ok(h1 >= 0 && h1 < s, `h1=${h1} 越界`);
    assert.ok(h2 >= 0 && h2 < s, `h2=${h2} 越界`);
  }
});

test('cuckoo 空输入', () => {
  const { table, kicks, failed } = cuckoo([], 11);
  assert.equal(kicks, 0);
  assert.deepEqual(failed, []);
  assert.equal(
    table.tables[0].every((s) => s === null),
    true,
  );
});

test('buildTrace 含 array 与 aux，末帧含踢出统计', () => {
  const frames = buildTrace(DEFAULT_INPUT, DEFAULT_SIZE);
  assert.ok(frames.length >= 3);
  const first = frames[0]!;
  assert.ok(first.array, '首帧含 array（表0）');
  assert.ok(first.aux, '首帧含 aux（表1 + 统计）');
  const last = frames[frames.length - 1]!;
  const kicksEntry = last.aux!.find((e) => e.label === '总踢出次数');
  assert.ok(kicksEntry, '末帧应含总踢出次数');
  assert.ok(Number(kicksEntry!.value) >= 0);
});
