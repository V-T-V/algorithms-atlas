import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bmHorspool, buildBadCharTable } from '../../src/algorithms/string/bm-horspool/impl.ts';

test('bm-horspool 基本行为', () => {
  assert.deepEqual(bmHorspool('ABC', ''), []);
  assert.deepEqual(bmHorspool('ABC', 'ABCDE'), []); // pat 比 text 长
  assert.deepEqual(bmHorspool('A', 'A'), [0]);
  assert.deepEqual(bmHorspool('ABCDEF', 'CD'), [2]);
});

test('bm-horspool 多处匹配（含重叠）', () => {
  assert.deepEqual(bmHorspool('AAAAA', 'AA'), [0, 1, 2, 3]);
  assert.deepEqual(bmHorspool('ABABDABACDABABCABAB', 'ABABCABAB'), [10]);
  assert.deepEqual(bmHorspool('HELLO WORLD', 'XYZ'), []);
});

test('bm-horspool 与朴素结果一致', () => {
  const text = 'abcababcabcaabcabcab';
  const pat = 'abcab';
  const naive: number[] = [];
  for (let i = 0; i + pat.length <= text.length; i++) {
    if (text.slice(i, i + pat.length) === pat) naive.push(i);
  }
  assert.deepEqual(bmHorspool(text, pat), naive);
});

test('bm-horspool 经典用例', () => {
  // Horspool 论文经典例：text=GCATCGCAGAGAGTATACAGTACG, pat=GCAGAGAG
  assert.deepEqual(bmHorspool('GCATCGCAGAGAGTATACAGTACG', 'GCAGAGAG'), [5]);
});

test('坏字符表正确性', () => {
  // pat="GCAGAGAG", m=8；只看前 7 位 GCAGAGA
  // 位置: 0:G 1:C 2:A 3:G 4:A 5:G 6:A 7:G
  // G 在前7位 (不含末位 7) 的最后位置是 5 → shift[G] = 8-1-5 = 2
  // C 在位 1 → shift[C] = 8-1-1 = 6
  // A 在位 2,4,6（最后 6）→ shift[A] = 8-1-6 = 1
  const t = buildBadCharTable('GCAGAGAG');
  assert.equal(t.get('G'), 2);
  assert.equal(t.get('C'), 6);
  assert.equal(t.get('A'), 1);
  // 未出现的字符不在表里（getShift 内部回退到 m）
  assert.equal(t.get('X'), undefined);
});

test('bm-horspool 钩子被调用', () => {
  let compare = 0;
  let shift = 0;
  let found = 0;
  bmHorspool('ABABCABAB', 'ABAB', {
    onCompare: () => compare++,
    onShift: () => shift++,
    onFound: () => found++,
  });
  assert.ok(compare > 0, '应触发 onCompare');
  assert.ok(shift > 0, '应触发 onShift');
  assert.ok(found >= 1, '应至少命中一次');
});

test('buildTrace 产生帧', async () => {
  const { buildTrace } = await import('../../src/algorithms/string/bm-horspool/trace.ts');
  const frames = buildTrace();
  assert.ok(frames.length > 2);
  assert.ok(frames[frames.length - 1]!.note?.zh);
  assert.ok(frames[frames.length - 1]!.note?.en);
});
