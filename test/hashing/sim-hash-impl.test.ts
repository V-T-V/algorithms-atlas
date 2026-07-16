import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  simHash,
  tokenize,
  computeWeights,
  hammingDistance,
  fingerprintToString,
} from '../../src/algorithms/hashing/sim-hash-impl/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/hashing/sim-hash-impl/trace.ts';

test('simHash 输出指定位宽', () => {
  for (const bits of [8, 16, 32, 64]) {
    const fp = simHash('hello world', bits);
    assert.equal(fp.length, bits);
    for (const b of fp) assert.ok(b === 0 || b === 1);
  }
});

test('simHash 确定性', () => {
  assert.deepEqual(simHash('the quick brown fox', 16), simHash('the quick brown fox', 16));
});

test('simHash 相同文档指纹相同', () => {
  const a = simHash('duplicate document content here', 32);
  const b = simHash('duplicate document content here', 32);
  assert.deepEqual(a, b);
  assert.equal(hammingDistance(a, b), 0);
});

test('simHash 相似文档汉明距离小', () => {
  const a = simHash('the quick brown fox jumps over the lazy dog', 32);
  const b = simHash('the quick brown fox jumps over a lazy dog', 32);
  const c = simHash('completely different unrelated random words', 32);
  assert.ok(hammingDistance(a, b) <= hammingDistance(a, c), '相似文档距离应 <= 不相似');
});

test('simHash 非法位宽抛错', () => {
  assert.throws(() => simHash('abc', 0));
  assert.throws(() => simHash('abc', -1));
});

test('tokenize 正确分词', () => {
  assert.deepEqual(tokenize('Hello, World!'), ['hello', 'world']);
  assert.deepEqual(tokenize('a b  c'), ['a', 'b', 'c']);
  assert.deepEqual(tokenize(''), []);
});

test('tokenize 保留中文', () => {
  const t = tokenize('你好 world');
  assert.ok(t.includes('你好'));
  assert.ok(t.includes('world'));
});

test('computeWeights 词频统计', () => {
  const w = new Map(computeWeights(['a', 'b', 'a', 'c', 'a']));
  assert.equal(w.get('a'), 3);
  assert.equal(w.get('b'), 1);
  assert.equal(w.get('c'), 1);
});

test('hammingDistance 正确', () => {
  assert.equal(hammingDistance([1, 0, 1, 1], [0, 0, 1, 0]), 2);
  assert.equal(hammingDistance([1, 1], [1, 1]), 0);
});

test('hammingDistance 长度不同抛错', () => {
  assert.throws(() => hammingDistance([1, 0], [1]));
});

test('fingerprintToString 正确', () => {
  assert.equal(fingerprintToString([1, 0, 1, 1]), '1011');
});

test('simHash 钩子：onFeature 与 onResult 触发', () => {
  let features = 0;
  let result = '';
  simHash('hello world foo', 16, {
    onFeature: () => features++,
    onResult: (fp) => (result = fp.join('')),
  });
  assert.ok(features >= 1);
  assert.equal(result.length, 16);
});

test('simHash 接受特征数组输入', () => {
  const fp = simHash(['alpha', 'beta', 'gamma'], 16);
  assert.equal(fp.length, 16);
});

test('buildTrace 含 array 与 aux，末帧含汉明距离', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.aux, '首帧含 aux');
  const last = frames[frames.length - 1]!;
  const h = last.aux!.find((e) => e.label === '汉明距离');
  assert.ok(h, '末帧应含汉明距离');
});
