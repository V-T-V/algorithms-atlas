import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AliasTable, type Rng } from '../../src/algorithms/randomized/alias-method/impl.ts';

/** 确定性 LCG 随机源。 */
function makeLcg(seed: number): Rng {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

test('alias-method 建表后 prob 与 alias 长度正确', () => {
  const t = new AliasTable([0.1, 0.2, 0.3, 0.4]);
  assert.equal(t.size, 4);
  assert.equal(t.prob.length, 4);
  assert.equal(t.alias.length, 4);
});

test('alias-method 采样下标落在 [0, n)', () => {
  const t = new AliasTable([0.25, 0.25, 0.25, 0.25]);
  const rng = makeLcg(7);
  for (let i = 0; i < 1000; i++) {
    const idx = t.sample(rng);
    assert.ok(idx >= 0 && idx < 4, `idx=${idx} 越界`);
  }
});

test('alias-method 大样本频率近似正确', () => {
  const probs = [0.1, 0.2, 0.3, 0.4];
  const t = new AliasTable(probs);
  const counts = t.sampleCounts(200000, makeLcg(42));
  const freqs = counts.map((c) => c / 200000);
  probs.forEach((p, i) => {
    assert.ok(Math.abs(freqs[i]! - p) < 0.01, `项 ${i}: 频率 ${freqs[i]} 偏离 ${p} 过大`);
  });
});

test('alias-method 归一化非单位和的概率', () => {
  // 输入未归一化（和=10），应内部归一化
  const probs = [1, 2, 3, 4]; // 等价于 [0.1,0.2,0.3,0.4]
  const t = new AliasTable(probs);
  const counts = t.sampleCounts(200000, makeLcg(123));
  const freqs = counts.map((c) => c / 200000);
  const expected = [0.1, 0.2, 0.3, 0.4];
  expected.forEach((p, i) => {
    assert.ok(Math.abs(freqs[i]! - p) < 0.01, `项 ${i}: 频率 ${freqs[i]} 偏离 ${p}`);
  });
});

test('alias-method 退化：单一项必采样到 0', () => {
  const t = new AliasTable([1]);
  const rng = makeLcg(5);
  for (let i = 0; i < 100; i++) {
    assert.equal(t.sample(rng), 0);
  }
});

test('alias-method 退化：两项各 50%', () => {
  const t = new AliasTable([0.5, 0.5]);
  const counts = t.sampleCounts(100000, makeLcg(9));
  const f0 = counts[0]! / 100000;
  assert.ok(Math.abs(f0 - 0.5) < 0.02, `f0=${f0}`);
});

test('alias-method 空数组抛错', () => {
  assert.throws(() => new AliasTable([]));
});

test('alias-method 全零概率抛错', () => {
  assert.throws(() => new AliasTable([0, 0, 0]));
});

test('alias-method 确定性：相同种子相同序列', () => {
  const t = new AliasTable([0.2, 0.3, 0.5]);
  const a: number[] = [];
  const b: number[] = [];
  const ra = makeLcg(100);
  const rb = makeLcg(100);
  for (let i = 0; i < 50; i++) {
    a.push(t.sample(ra));
    b.push(t.sample(rb));
  }
  assert.deepEqual(a, b);
});

test('alias-method 建表钩子被调用', () => {
  const pairs: Array<[number, number]> = [];
  const t = new AliasTable([0.1, 0.2, 0.3, 0.4], {
    onBuild: (s, l) => pairs.push([s, l]),
  });
  // 至少配对过几次（n-1 次左右）
  assert.ok(pairs.length >= 1);
  // 每个 small 的 alias 应被记录
  for (const [s, l] of pairs) {
    assert.equal(t.alias[s], l);
  }
});

test('alias-method 偏斜分布（一项概率接近 1）', () => {
  const probs = [0.97, 0.01, 0.01, 0.01];
  const t = new AliasTable(probs);
  const counts = t.sampleCounts(200000, makeLcg(55));
  const freqs = counts.map((c) => c / 200000);
  probs.forEach((p, i) => {
    assert.ok(Math.abs(freqs[i]! - p) < 0.01, `项 ${i}: 频率 ${freqs[i]} 偏离 ${p}`);
  });
});
