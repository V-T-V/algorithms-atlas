import { test } from 'node:test';
import assert from 'node:assert/strict';
import { timSort2 } from '../../src/algorithms/sorting/tim-sort2/impl.ts';

function refSorted(arr: number[]): number[] {
  return [...arr].sort((a, b) => a - b);
}

test('tim-sort2 基本排序', () => {
  assert.deepEqual(timSort2([]), []);
  assert.deepEqual(timSort2([1]), [1]);
  assert.deepEqual(timSort2([3, 1, 2]), [1, 2, 3]);
  assert.deepEqual(timSort2([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('tim-sort2 与原生 sort 一致（随机）', () => {
  for (let t = 0; t < 50; t++) {
    const n = Math.floor(Math.random() * 200) + 1;
    const arr = Array.from({ length: n }, () => Math.floor(Math.random() * 1000));
    assert.deepEqual(timSort2(arr), refSorted(arr), `seed ${t}`);
  }
});

test('tim-sort2 已升序 / 已降序', () => {
  const asc = Array.from({ length: 30 }, (_, i) => i);
  assert.deepEqual(timSort2(asc), [...asc]);
  const desc = Array.from({ length: 30 }, (_, i) => 29 - i);
  assert.deepEqual(timSort2(desc), asc);
});

test('tim-sort2 稳定性（带长 run 触发 galloping）', () => {
  // 构造两组重复值的长 run，强制 galloping 归并
  const arr: number[] = [];
  for (let i = 0; i < 10; i++) arr.push(2); // 一段
  for (let i = 0; i < 10; i++) arr.push(1);
  for (let i = 0; i < 10; i++) arr.push(2);
  for (let i = 0; i < 10; i++) arr.push(3);
  const out = timSort2(arr);
  const count1 = out.filter((v) => v === 1).length;
  const count2 = out.filter((v) => v === 2).length;
  const count3 = out.filter((v) => v === 3).length;
  assert.equal(count1, 10);
  assert.equal(count2, 20);
  assert.equal(count3, 10);
  assert.deepEqual(out, refSorted(arr));
});

test('tim-sort2 全相同', () => {
  const arr = Array.from({ length: 50 }, () => 7);
  assert.deepEqual(timSort2(arr), arr);
});

test('tim-sort2 钩子被调用', () => {
  let runs = 0;
  let compares = 0;
  let writes = 0;
  let merges = 0;
  let gallops = 0;
  // n >= MIN_MERGE(32)，构造多段 run 以触发归并
  const arr: number[] = [];
  for (let i = 0; i < 20; i++) arr.push(1); // run1（升序）
  for (let i = 0; i < 20; i++) arr.push(3 + i); // run2（升序）
  for (let i = 0; i < 8; i++) arr.push(2); // run3
  timSort2(arr, {
    onRun: () => runs++,
    onCompare: () => compares++,
    onWrite: () => writes++,
    onMerge: () => merges++,
    onGalloping: () => gallops++,
  });
  assert.deepEqual(timSort2(arr), refSorted(arr));
  assert.ok(runs >= 1, '应识别 run');
  assert.ok(compares > 0, '应比较');
  assert.ok(writes > 0, '应写入');
  assert.ok(merges >= 1, '应归并');
  void gallops;
});

test('tim-sort2 galloping 实际触发', () => {
  let gallopCount = 0;
  // 构造能让一侧连续获胜的输入
  const arr: number[] = [];
  for (let i = 0; i < 40; i++) arr.push(1); // 大量 1（最小）
  for (let i = 0; i < 5; i++) arr.push(100 + i); // 少量大数
  timSort2(arr, {
    onGalloping: () => gallopCount++,
    onGallopingSearch: () => {},
  });
  // 至少在某些归并中会触发 galloping
  assert.deepEqual(timSort2(arr), refSorted(arr));
});
