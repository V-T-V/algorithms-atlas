// =============================================================================
// 布隆过滤器 · 录制帧序列
// 用 setBars 展示位数组（每位一个柱：置 1 标 'final'，当前操作的位标
// 'compare'/'pivot'，查询命中位标 'final'，查询发现 0 位标 'warn'）。
// 用 setAux 展示 m / k / 已置 1 位数 / add 次数。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { BloomFilter, type BloomFilterHooks } from './impl.ts';

/** 演示：加入若干元素，再查询「已加入」(true) 与「未加入」(可能 true/false)。 */
export const DEFAULT_INPUT = {
  m: 16,
  k: 3,
  adds: ['apple', 'banana', 'cherry'],
  checks: ['apple', 'banana', 'grape', 'mango'],
};

/** 录制演示帧序列。 */
export function buildTrace(
  input: {
    m?: number;
    k?: number;
    adds?: readonly string[];
    checks?: readonly string[];
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const m = input.m ?? 16;
  const k = input.k ?? 3;
  const bf = new BloomFilter(m, k);

  let hotBits = new Set<number>();
  let newBits = new Set<number>();
  let queryMode = false;
  let missBit = -1;

  const snapshot = (note: { zh: string; en: string }): void => {
    const bits = bf.toArray();
    const vals = bits.map((b) => (b ? 1 : 0));
    const roles: BarRole[] = bits.map((b, i) => {
      if (queryMode && missBit === i) return 'warn';
      if (hotBits.has(i)) return queryMode ? (bits[i] ? 'final' : 'warn') : 'pivot';
      if (newBits.has(i)) return 'final';
      return b ? 'sorted' : 'default';
    });
    rec
      .begin(note)
      .setBars(vals.map((v, i) => ({ value: v, role: roles[i] ?? 'default' })))
      .setAux([
        { label: 'm', value: String(m), role: 'compare' },
        { label: 'k', value: String(k), role: 'compare' },
        { label: '置1位数', value: String(bf.bitsSet), role: 'final' },
        { label: 'add次数', value: String(bf.count), role: 'final' },
      ])
      .commit();
    hotBits = new Set();
    newBits = new Set();
    missBit = -1;
  };

  snapshot({
    zh: `空布隆过滤器（m=${m} 位, k=${k} 哈希）`,
    en: `Empty Bloom filter (m=${m} bits, k=${k} hashes)`,
  });

  const addHooks: BloomFilterHooks = {
    onHash: (key, i, idx) => {
      void key;
      void i;
      hotBits.add(idx);
    },
    onSetBit: (idx, wasSet) => {
      hotBits.add(idx);
      if (!wasSet) newBits.add(idx);
      snapshot({
        zh: `置位 [${idx}]${wasSet ? '（已为 1）' : ''}`,
        en: `Set bit [${idx}]${wasSet ? ' (already 1)' : ''}`,
      });
    },
    onAdd: (key) => {
      snapshot({ zh: `加入 ${key} 完成`, en: `Added ${key}` });
    },
  };

  for (const key of input.adds ?? []) bf.add(key, addHooks);

  // 切换为查询模式
  queryMode = true;

  const checkHooks: BloomFilterHooks = {
    onHash: (key, i, idx) => {
      void key;
      void i;
      hotBits.add(idx);
    },
    onCheckBit: (idx, isSet) => {
      hotBits.add(idx);
      if (!isSet) missBit = idx;
    },
    onResult: (key, maybe) => {
      snapshot(
        maybe
          ? {
              zh: `查询 ${key} → 可能在（k 位全为 1）`,
              en: `Check ${key} → maybe in (all k bits set)`,
            }
          : {
              zh: `查询 ${key} → 一定不在（发现 0 位）`,
              en: `Check ${key} → definitely not (found a 0 bit)`,
            },
      );
    },
  };

  for (const key of input.checks ?? []) bf.contains(key, checkHooks);

  // 终态
  queryMode = false;
  const bits = bf.toArray();
  const vals = bits.map((b) => (b ? 1 : 0));
  rec
    .begin({
      zh: `完成，置 1 位数 ${bf.bitsSet}/${m}，add 次数 ${bf.count}`,
      en: `Done, ${bf.bitsSet}/${m} bits set, ${bf.count} adds`,
    })
    .setBars(vals.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
