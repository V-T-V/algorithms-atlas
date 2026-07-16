import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  UniversalHashFamily,
  mulberry32,
  DEFAULT_PRIME,
} from '../../src/algorithms/hashing/universal-hashing-impl/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/hashing/universal-hashing-impl/trace.ts';

test('UniversalHashFamily hash 输出在 [0, m)', () => {
  const fam = new UniversalHashFamily(8);
  const fn = fam.sample();
  for (let k = 0; k < 1000; k++) {
    const b = fam.hash(k, fn);
    assert.ok(b >= 0 && b < 8, `b=${b} 越界`);
  }
});

test('UniversalHashFamily hash 确定性（同 a,b 同结果）', () => {
  const fam = new UniversalHashFamily(16);
  const fn = { a: 12345, b: 67890 };
  for (let k = 0; k < 100; k++) {
    assert.equal(fam.hash(k, fn), fam.hash(k, fn));
  }
});

test('UniversalHashFamily sample 产生合法 a,b', () => {
  const fam = new UniversalHashFamily(8);
  for (let i = 0; i < 100; i++) {
    const fn = fam.sample();
    assert.ok(fn.a >= 1 && fn.a <= DEFAULT_PRIME - 1, `a=${fn.a}`);
    assert.ok(fn.b >= 0 && fn.b <= DEFAULT_PRIME - 1, `b=${fn.b}`);
  }
});

test('UniversalHashFamily assign 桶计数和 = 键数', () => {
  const fam = new UniversalHashFamily(8);
  const fn = fam.sample();
  const keys = [1, 2, 3, 4, 5, 10, 20, 30];
  const counts = fam.assign(keys, fn);
  assert.equal(
    counts.reduce((a, b) => a + b, 0),
    keys.length,
  );
});

test('UniversalHashFamily assign 输出 m 个桶', () => {
  const fam = new UniversalHashFamily(8);
  const fn = fam.sample();
  const counts = fam.assign([1, 2, 3], fn);
  assert.equal(counts.length, 8);
});

test('UniversalHashFamily 非法参数抛错', () => {
  assert.throws(() => new UniversalHashFamily(0));
  assert.throws(() => new UniversalHashFamily(8, 1));
});

test('UniversalHashFamily 碰撞率统计：随机抽样下任意两键碰撞概率约 1/m', () => {
  const m = 100;
  const fam = new UniversalHashFamily(m);
  const x = 11111;
  const y = 22222;
  let collide = 0;
  const trials = 5000;
  for (let i = 0; i < trials; i++) {
    const fn = fam.sample();
    if (fam.hash(x, fn) === fam.hash(y, fn)) collide++;
  }
  const rate = collide / trials;
  // 应接近 1/m = 0.01，允许宽松范围 [0.005, 0.02]
  assert.ok(rate < 0.02, `碰撞率 ${rate} 过高`);
  assert.ok(rate > 0.003, `碰撞率 ${rate} 过低（疑似不随机）`);
});

test('mulberry32 确定性', () => {
  const r1 = mulberry32(999);
  const r2 = mulberry32(999);
  for (let i = 0; i < 20; i++) assert.equal(r1(), r2());
});

test('UniversalHashFamily 钩子：onSample 与 onHash 触发', () => {
  const fam = new UniversalHashFamily(8);
  let samples = 0;
  let hashes = 0;
  const fn = fam.sample({ onSample: () => samples++ });
  fam.hash(42, fn, { onHash: () => hashes++ });
  fam.hash(43, fn, { onHash: () => hashes++ });
  assert.equal(samples, 1);
  assert.equal(hashes, 2);
});

test('UniversalHashFamily 不同种子 rng 产生不同分布', () => {
  const fam1 = new UniversalHashFamily(8, DEFAULT_PRIME, mulberry32(1));
  const fam2 = new UniversalHashFamily(8, DEFAULT_PRIME, mulberry32(2));
  const f1 = fam1.sample();
  const f2 = fam2.sample();
  // 大概率 a 或 b 不同
  assert.ok(f1.a !== f2.a || f1.b !== f2.b);
});

test('buildTrace 含 array 与 aux，末帧含期望冲突对', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.array, '首帧含 array');
  const last = frames[frames.length - 1]!;
  const c = last.aux!.find((e) => e.label === '期望冲突对');
  assert.ok(c, '末帧应含期望冲突对');
});
