import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HashTable, hashTable } from '../../src/algorithms/ds/hash-table/impl.ts';

test('hash-table 插入与查找', () => {
  const ht = new HashTable(7);
  assert.equal(ht.put('apple', 1), true);
  assert.equal(ht.put('banana', 2), true);
  assert.equal(ht.put('cherry', 3), true);
  assert.equal(ht.size, 3);
  assert.equal(ht.get('apple'), 1);
  assert.equal(ht.get('banana'), 2);
  assert.equal(ht.get('cherry'), 3);
  assert.equal(ht.get('grape'), undefined);
});

test('hash-table 更新已存在的键', () => {
  const ht = new HashTable(7);
  assert.equal(ht.put('apple', 1), true); // 新增
  assert.equal(ht.put('apple', 10), false); // 更新
  assert.equal(ht.size, 1);
  assert.equal(ht.get('apple'), 10);
});

test('hash-table 删除', () => {
  const ht = hashTable(
    [
      { key: 'a', value: 1 },
      { key: 'b', value: 2 },
      { key: 'c', value: 3 },
    ],
    5,
  );
  assert.equal(ht.delete('b'), true);
  assert.equal(ht.get('b'), undefined);
  assert.equal(ht.size, 2);
  assert.equal(ht.delete('b'), false); // 再删返回 false
  assert.equal(ht.delete('zzz'), false);
});

test('hash-table has 与 keys', () => {
  const ht = hashTable(
    [
      { key: 'x', value: 1 },
      { key: 'y', value: 2 },
    ],
    5,
  );
  assert.equal(ht.has('x'), true);
  assert.equal(ht.has('y'), true);
  assert.equal(ht.has('z'), false);
  assert.deepEqual(ht.keys().sort(), ['x', 'y']);
});

test('hash-table 冲突：同桶链表正确', () => {
  // 用极小桶数强制冲突
  const ht = new HashTable(1);
  for (let i = 0; i < 50; i++) ht.put(`key${i}`, i);
  assert.equal(ht.size, 50);
  for (let i = 0; i < 50; i++) assert.equal(ht.get(`key${i}`), i);
  // 删除一半后剩余正确
  for (let i = 0; i < 50; i += 2) ht.delete(`key${i}`);
  assert.equal(ht.size, 25);
  for (let i = 1; i < 50; i += 2) assert.equal(ht.get(`key${i}`), i);
  for (let i = 0; i < 50; i += 2) assert.equal(ht.get(`key${i}`), undefined);
});

test('hash-table 负载因子', () => {
  const ht = new HashTable(10);
  assert.equal(ht.loadFactor(), 0);
  for (let i = 0; i < 5; i++) ht.put(`k${i}`, i);
  assert.equal(ht.loadFactor(), 0.5);
});

test('hash-table 边界：空 / 空 key', () => {
  const ht = new HashTable(7);
  assert.equal(ht.isEmpty(), true);
  assert.equal(ht.get('anything'), undefined);
  assert.equal(ht.delete('anything'), false);
  // 空串作为 key
  ht.put('', 99);
  assert.equal(ht.get(''), 99);
  assert.equal(ht.size, 1);
  assert.equal(ht.isEmpty(), false);
});

test('hash-table 数字字符串 key 也可', () => {
  const ht = new HashTable(8);
  ht.put('1', 100);
  ht.put('2', 200);
  ht.put('11', 1100);
  assert.equal(ht.get('1'), 100);
  assert.equal(ht.get('11'), 1100);
});

test('hash-table 钩子被调用', () => {
  let hashes = 0;
  let inserts = 0;
  let probes = 0;
  const ht = new HashTable(3);
  ht.put('a', 1, {
    onHash: () => hashes++,
    onInsert: () => inserts++,
  });
  ht.get('a', { onProbe: () => probes++ });
  assert.ok(hashes > 0, 'put 应触发 onHash');
  assert.equal(inserts, 1);
  assert.ok(probes > 0, 'get 应触发 onProbe');
});

test('hash-table get 未命中也回调 onResult', () => {
  let foundVal = true;
  let called = 0;
  const ht = new HashTable(7);
  ht.get('missing', {
    onResult: (_kind, _key, found) => {
      called++;
      foundVal = found;
    },
  });
  assert.equal(called, 1);
  assert.equal(foundVal, false);
});
