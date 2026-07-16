import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  MersenneTwister,
  generateMersenneSequence,
} from '../../src/algorithms/randomized/mersenne-twister/impl.ts';

test('mersenne-twister 固定种子确定性输出', () => {
  const a = generateMersenneSequence(542171377, 5);
  const b = generateMersenneSequence(542171377, 5);
  assert.deepEqual(a, b);
});

test('mersenne-twister seed=542171377 前 5 个值', () => {
  const seq = generateMersenneSequence(542171377, 5);
  assert.deepEqual(seq, [989324138, 130234891, 1097208604, 3859178789, 717634418]);
});

test('mersenne-twister seed=42 前 5 个值', () => {
  const seq = generateMersenneSequence(42, 5);
  assert.deepEqual(seq, [1608637542, 3421126067, 4083286876, 787846414, 3143890026]);
});

test('mersenne-twister 输出为无符号 32 位', () => {
  const gen = new MersenneTwister(12345);
  for (let i = 0; i < 2000; i++) {
    const v = gen.next();
    assert.ok(Number.isInteger(v));
    assert.ok(v >= 0 && v < 0x100000000, `v=${v} 越界`);
  }
});

test('mersenne-twister 跨越 twist 边界（> 624）仍连续正确', () => {
  const gen = new MersenneTwister(999);
  const first = [];
  for (let i = 0; i < 700; i++) first.push(gen.next());
  // 前 5 与从头独立实例一致
  const fresh = generateMersenneSequence(999, 5);
  assert.deepEqual(first.slice(0, 5), fresh);
});

test('mersenne-twister 前 2000 个值无重复（足够长以触发多次 twist）', () => {
  const gen = new MersenneTwister(777);
  const seen = new Set<number>();
  for (let i = 0; i < 2000; i++) {
    const v = gen.next();
    assert.equal(seen.has(v), false, `第 ${i} 个值重复`);
    seen.add(v);
  }
});

test('mersenne-twister nextInt 落在 [0, max)', () => {
  const gen = new MersenneTwister(555);
  const max = 100;
  for (let i = 0; i < 1000; i++) {
    const v = gen.nextInt(max);
    assert.ok(v >= 0 && v < max, `v=${v} 越界`);
  }
});

test('mersenne-twister nextFloat 落在 [0, 1)', () => {
  const gen = new MersenneTwister(321);
  for (let i = 0; i < 1000; i++) {
    const v = gen.nextFloat();
    assert.ok(v >= 0 && v < 1, `v=${v} 越界`);
  }
});

test('mersenne-twister 不同种子产生不同序列', () => {
  const a = generateMersenneSequence(1, 5);
  const b = generateMersenneSequence(2, 5);
  assert.notDeepEqual(a, b);
});

test('mersenne-twister 钩子被调用', () => {
  const values: number[] = [];
  generateMersenneSequence(542171377, 3, {
    onNext: (v) => values.push(v),
  });
  assert.equal(values.length, 3);
  assert.deepEqual(values, [989324138, 130234891, 1097208604]);
});
